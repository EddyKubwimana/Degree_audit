<?php

include "access_headers.php";
include "../settings/connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    // Decode JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    $email = $input['email'];
    $code = $input['authcode'];

    $sql = "SELECT auth_code FROM STUDENT WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email); // Execute the prepared statement with parameter binding

    if ($stmt ->execute())
    {
        $row = $stmt->get_result()->fetch_assoc();
        if ($row)
        {
            if ($row['auth_code'] == $code)
            {
                $auth_code = $row['auth_code'];
                $sql = "UPDATE STUDENT SET status = 1 WHERE email = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $email); 

                if (!$stmt->execute())
                {
                    echo json_encode(array('status' => 'error', 'message' => 'Error executing update query'));
                    exit;
                }
                else
                {
                    echo json_encode(array('status' => 'success', 'auth_code' => $auth_code));
                    exit;
                }
            }
            else
            {
                echo json_encode(array('status' => 'error', 'message' => 'Invalid code'));
            }
        }
        else
        {
            echo json_encode(array('status' => 'error', 'message' => 'Invalid email'));
        }
    }
    else
    {
        echo json_encode(array('status' => 'error', 'message' => 'Error executing query'));
    }
}
?>