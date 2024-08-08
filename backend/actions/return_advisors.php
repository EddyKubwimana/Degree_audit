<?php
include "access_headers.php";
require_once '../settings/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') 
{
   
    $sql = "SELECT * FROM Advisors";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->execute()) {
        
        $result = $stmt->get_result();
        $advisors = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode(['advisors' => $advisors, 'error' => false]);
    } else {
       
        echo json_encode(['error' => true, 'message' => 'Failed to fetch advisors']);
    }
    
    
    $stmt->close();
}

$conn->close();
?>
