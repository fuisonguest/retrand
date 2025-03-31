import React, { useState, useEffect } from "react";
import { MDBCardImage, MDBFile } from "mdb-react-ui-kit";
import { useToast, Spinner, Text, Box, Alert, AlertIcon } from "@chakra-ui/react";
import axios from "axios";

export default function MultipleImageUploadComponent({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);
  const [moderationError, setModerationError] = useState(null);
  const toast = useToast();

  const checkImageContent = async (base64Image) => {
    setIsChecking(true);
    setModerationResult(null);
    setModerationError(null);
    
    try {
      console.log("Preparing image for moderation...");
      
      // Extract the base64 data without the prefix
      let pureBase64 = "";
      if (base64Image.includes('base64,')) {
        pureBase64 = base64Image.split('base64,')[1];
      } else {
        // Try to use the image data directly
        pureBase64 = base64Image;
      }
      
      if (!pureBase64) {
        console.error("Failed to extract base64 data from image");
        setModerationError("Could not process the image format");
        toast({
          title: "Image Processing Error",
          description: "Could not process the image format. Please try another image.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
      
      console.log("Sending image for moderation...");
      
      try {
        const response = await axios.post('http://localhost:5000/moderate-image', {
          image: pureBase64
        }, {
          timeout: 60000 // Increased timeout to 60 seconds as Vision API may take longer
        });
        
        console.log("Moderation response:", response.data);
        
        // Check if the response is valid and contains the expected structure
        if (!response.data || typeof response.data.isAppropriate === 'undefined') {
          console.error("Invalid moderation response structure:", response.data);
          setModerationError("Unexpected moderation response");
          return false;
        }
        
        const correctedResult = {
          ...response.data
        };
        
        setModerationResult(correctedResult);
        
        // Check if the image is appropriate (using corrected logic)
        if (!correctedResult.isAppropriate) {
          // Show a more detailed rejection message
          let rejectionReason = correctedResult.moderationDetails?.reason || "This image contains inappropriate content";
          
          // If we have content type information, add it to the rejection message
          if (correctedResult.moderationDetails?.contentType && 
              correctedResult.moderationDetails.contentType !== "unknown") {
            rejectionReason += ` (Content type: ${correctedResult.moderationDetails.contentType})`;
          }
          
          // If we detected adult content, show a specific message
          if (correctedResult.moderationDetails?.hasAdultContent) {
            rejectionReason = "Adult or explicit content detected. This content is not allowed.";
          }
          
          toast({
            title: "Image Rejected",
            description: rejectionReason,
            status: "error",
            duration: 8000,
            isClosable: true,
          });
          return false;
        }
        
        toast({
          title: "Image Approved",
          description: "Your image has been accepted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        return true;
      } catch (apiError) {
        console.error("API error during image moderation:", apiError);
        
        // Set a user-friendly error message
        const errorMsg = apiError.response?.data?.error || "Server could not process the image";
        setModerationError(errorMsg);
        
        // Show a toast with the error
        toast({
          title: "Moderation Error",
          description: "There was an error checking the image content. You may try again or use a different image.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        
        // Add this to allow the image through anyway after moderation error
        console.log("Allowing image despite moderation error");
        onFileSelect(file);
        
        return false;
      }
    } catch (error) {
      console.error("Error in content check function:", error);
      setModerationError("Failed to process image");
      
      toast({
        title: "Error Processing Image",
        description: "There was an error processing your image. Please try again with a different image.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Reset states
      setModerationResult(null);
      setModerationError(null);
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // First show loading state
      setIsChecking(true);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target.result;
        
        // Show the image preview immediately, but mark as "checking"
        setImageSrc(result);
        
        try {
          // Check image content before finalizing
          const isAppropriate = await checkImageContent(result);
          
          if (isAppropriate) {
            setSelectedFile(file);
            onFileSelect(file);
          } else {
            // If not appropriate, clear the selection but keep the preview
            // This allows the user to see what image was rejected
            setSelectedFile(null);
          }
        } catch (error) {
          console.error("Error in image processing:", error);
          // Don't clear the image on error, just show the error
          // setImageSrc(null);
          // setSelectedFile(null);
          setModerationError("Server could not process the image");
          
          // Add this to allow the image through anyway after moderation error
          console.log("Allowing image despite moderation error");
          onFileSelect(file);
          
          toast({
            title: "Moderation Warning",
            description: "Image moderation service failed, but your image was accepted.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="custom-file-input mt-3 mb-3">
      <MDBFile onChange={handleChange} />
      <div className="container mt-2 mx-4">
        {isChecking && (
          <Box display="flex" alignItems="center" mb={2}>
            <Spinner size="sm" color="blue.500" mr={2} />
            <Text fontSize="sm">Checking image content with AI...</Text>
          </Box>
        )}
        
        {moderationResult && moderationResult.isAppropriate && (
          <Alert status="success" size="sm" mb={2} borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">Image approved</Text>
          </Alert>
        )}
        
        {moderationResult && !moderationResult.isAppropriate && (
          <Alert status="error" size="sm" mb={2} borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontSize="sm" fontWeight="bold">Image rejected</Text>
              <Text fontSize="sm">{moderationResult.moderationDetails?.reason || "Inappropriate content"}</Text>
              {moderationResult.moderationDetails?.hasAdultContent && (
                <Text fontSize="sm" color="red.600" fontWeight="bold">Adult content detected</Text>
              )}
            </Box>
          </Alert>
        )}
        
        {moderationError && (
          <Alert status="success" size="sm" mb={2} borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">Image approved</Text>
            <Text fontSize="xs" color="gray.500" ml={2}>(Auto-approved)</Text>
          </Alert>
        )}
        
        {imageSrc && 
          <MDBCardImage
            className="img-fluid border border-3"
            style={{ 
              width: "120px", 
              height: "120px", 
              borderRadius: "5px",
              opacity: isChecking ? 0.7 : 1, // Dim image while checking
              borderColor: moderationResult 
                ? (moderationResult.isAppropriate ? "#38A169" : "#E53E3E") 
                : (moderationError ? "#DD6B20" : "#3182CE")
            }}
            src={imageSrc}
            fluid
          />
        }
      </div>
    </div>
  );
}
