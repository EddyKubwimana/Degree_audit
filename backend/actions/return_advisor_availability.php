<?php
include "access_headers.php";
require_once '../settings/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $advisor_id = (int)$input['advisor_id'];

    $sql = "SELECT Date, StartTime, EndTime FROM Sessions WHERE AdvisorID = ? AND IsBooked = 0";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $advisor_id);

    if (!$stmt) {
        $error = $conn->error;
        echo json_encode([
            'error' => 'Failed to prepare statement',
            'details' => $error
        ]);
        exit;
    }

    if (!$stmt->execute()) {
        $error = $stmt->error;
        echo json_encode([
            'error' => 'Failed to execute statement',
            'details' => $error
        ]);
        exit;
    }

    $result = $stmt->get_result();
    $availability = [];

    while ($row = $result->fetch_assoc()) {
        $availability[] = [
            'date' => $row['Date'],
            'start_time' => $row['StartTime'],
            'end_time' => $row['EndTime']
        ];
    }

    echo json_encode([
        'availability' => $availability,
        'advisor_id' => $advisor_id,
        'error' => null
    ]);
}
?>

