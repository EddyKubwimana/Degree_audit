<?php

include "access_headers.php";
include "../settings/connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Decode JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input && is_array($input)) {
        // Prepare SQL statement with placeholders
        $sql = "INSERT INTO COURSE (studentid, name, grade, units) VALUES (?, ?, ?, ?)";

        // Prepare the statement
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            $error = $conn->error;
            $errorCode = $conn->errno;
            
            echo json_encode([
                'error' => 'Failed to prepare statement',
                'details' => $error,
                'code' => $errorCode
            ]);
            exit;
        }

        foreach ($input as $course) {
            // Validate and sanitize input data
            $studentId = intval($course['studentId']);
            $name = htmlspecialchars($course['name']);
            $grade = htmlspecialchars($course['grade']);
            $units = intval($course['units']);

            // Bind parameters and execute statement
            $stmt->bind_param("issi", $studentId, $name, $grade, $units);

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
        }

        // Successful response
        echo json_encode(['success' => 'Courses saved successfully']);
    } else {
        echo json_encode(['error' => 'Invalid input data']);
    }
}
?>
