<?php
include "access_headers.php";
require_once '../settings/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    // Decode JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = (int)$input['user_id'];

    $sql = "SELECT NAME, GRADE, UNITS FROM COURSE WHERE STUDENTID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);

    if (!$stmt) {
        $error = $conn->error;
        echo json_encode([
            'error' => 'Failed to prepare statement',
            'details' => $error
        ]);
        exit;
    }

    if (!$stmt->execute()) {
        $error = $conn->error;
        $errorCode = $conn->errno;

        echo json_encode([
            'error' => 'Failed to prepare statement',
            'details' => $error,
            'code' => $errorCode
        ]);
        exit;
    }
    else 
    {
        $result = $stmt->get_result();
        $error = $conn->error;
        $errorCode = $conn->errno;
        $courses = [];
        while ($row = $result->fetch_assoc()) 
        {
            $courses[] = $row;
        }

        echo json_encode(['courses' => $courses, 'id' => $user_id, 'error' => $error, 'code' => $errorCode, 'result' => $result]);
    }
}
?>