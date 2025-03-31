import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import {
  MDBCard,
  MDBCardHeader,
  MDBContainer,
  MDBListGroup,
  MDBListGroupItem,
  MDBBtn,
} from "mdb-react-ui-kit";
import Sell from "./Sell";
import MultipleImageUploadComponent from "./SellFormComponents/multiple-image-upload.component";
import Price from "./SellFormComponents/Price";
import SelectLocation from "./SellFormComponents/SelectLocation";
import Details from "./SellFormComponents/Details";
import Addetails from "./SellFormComponents/Addetails";
import VehicleSelector from "./SellFormComponents/VehicleSelector";
import CategoryFields from "./SellFormComponents/CategoryFields";
import axios from "axios";
import { categories } from "./resources/Catagories";
import NotFound from "./resources/NotFound";
import { useToast } from "@chakra-ui/react";


export default function SellForm() {
  const { category } = useParams();
  const { item } = useParams();

  //
  const isValidCategory = category.toLowerCase() === "olx autos (cars)" || category.toLowerCase() === "bikes";

  const [showComponent, setShowComponent] = useState(false);
  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  const [formInputs, setFormInputs] = useState([]);

  const handleAddForm = () => {
    if (formInputs.length < 12) {
      // check if the length of formInputs is less than 12
      setFormInputs((prevFormInputs) => [
        ...prevFormInputs,
        <MultipleImageUploadComponent
          key={prevFormInputs.length}
          onFileSelect={(file) => handleFileChange(file)}
        />,
      ]);
    }
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [price, setPrice] = useState();
  const [location, setLocation] = useState([]);
  const [address, setaddress] = useState([]);
  const [addorloc, setaddorloc] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [name, setName] = useState();
  const [vehicleData, setVehicleData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const toast = useToast();


  const handleFileChange = (file) => {
    // Handle the uploaded file here
    setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, file]);
  };
  const handlePriceChange = (price) => {
    // Handle the uploaded Price here
    setPrice(price);
  };

  const handleAddressChange = ({ location, address, addorloc }) => {
    setLocation(location);
    setaddress(address);
    setaddorloc(addorloc);
  };

  const handleDetailsChange = ({ title, description }) => {
    // Handle the Details here
    setTitle(title);
    setDescription(description);
  };

  const handleVehicleDataChange = (data) => {
    // Handle the vehicle data here
    setVehicleData(data);
  };

  const handleCategoryDataChange = (data) => {
    // Handle the category data here
    setCategoryData(data);
  };

  function handleNameSelect(name) {
    setName(name);
  }
  function handleImageSelect(img) {
   setImage(img);
  }
  
async function handleFormSubmit(event) {
  
  event.preventDefault();

const errors = [];

if (!title) {
  errors.push("Please add title");
}
if (!description) {
  errors.push("Please add description");
}
if ((address.length === 0 && addorloc==="address")|| (location.length === 0 && addorloc==="location")){
  errors.push("Please add address or location");
}
if (uploadedFiles.length === 0) {
  errors.push("Please upload a file");
}
if (!name) {
  errors.push("Please add your name");
}
if (!price) {
  errors.push("Please provide a price");
}
if (!vehicleData.brand || !vehicleData.model) {
  errors.push("Please select vehicle brand and model");
}

if (errors.length > 0) {
  toast({
    title: "Error",
    description: <div dangerouslySetInnerHTML={{ __html: errors.join("<br>") }} />,
    status: "error",
    duration: 5000,
    isClosable: true,
  });

  return;
}
  setLoading("post");

  try {
    const [x] = addorloc === "address" ? [address] : [location];

    const [imageUrl, picUrls] = await Promise.all([
      image
        ? (async () => {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "random");
            const { data } = await axios.post(
              "https://api.cloudinary.com/v1_1/dlpjayfhf/image/upload",
              formData,
              {
                headers: {
                  Accept: "multipart/form-data",
                },
              }
            );
            return data.secure_url;
          })()
        : "",
      uploadedFiles.length > 0
        ? Promise.all(
            uploadedFiles.map(async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "random");
              const { data } = await axios.post(
                "https://api.cloudinary.com/v1_1/dlpjayfhf/image/upload",
                formData,
                {
                  headers: {
                    Accept: "multipart/form-data",
                  },
                }
              );
              return data.secure_url;
            })
          )
        : [],
    ]);
    
    // Add specific validation for vehicle data when in vehicle categories
    if (!vehicleData.vehicleType) {
      errors.push("Please select vehicle type");
    }

    if (errors.length > 0) {
      toast({
        title: "Error",
        description: <div dangerouslySetInnerHTML={{ __html: errors.join("<br>") }} />,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    setLoading("post");

    // Prepare the data to be sent to the server
    console.log("Vehicle data being sent:", vehicleData);
    console.log("Category data being sent:", categoryData);
    console.log("Location data being sent:", addorloc === "address" ? address : location);

    const productData = {
      title,
      description,
      address: addorloc === "address" ? address : location,
      price,
      uploadedFiles: picUrls,
      image: imageUrl,
      name,
      catagory: category,
      subcatagory: item,
      vehicleData: vehicleData,
      categoryData: categoryData
    };
    
    console.log("Full product data being sent:", productData);
    
    const token = localStorage.getItem('authToken');
    await axios.post("http://localhost:5000/add_product", productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    setLoading("redirect");

  } catch (error) {
    console.log(error);
    toast({
      title: "Error",
      description: "Failed to post your ad. Please try again.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
}
  return (
    <div>
      {isValidCategory ? (
        <MDBContainer style={{ textAlign: "start" }} className="mt-3 mb-3">
          {loading === "post"? (
            <div className="back">
              <div className="lo-container">
                <ReactLoading
                  type="spin"
                  color="green"
                  height={"10%"}
                  width={"10%"}
                />
              </div>
            </div>
          ) : (
            <MDBCard>
              <MDBCardHeader>                
                <h5>
                  <b>SELECTED CATEGORY</b>
                </h5>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p className="mt-2">
                    {category} / {item}
                  </p>
                  <p onClick={handleClick}>
                    <u>
                      <b>Change</b>
                    </u>
                  </p>
                </div>
                {showComponent && <Sell />}
              </MDBCardHeader>
              <MDBListGroup flush>
                <MDBListGroupItem>
                  <h5>
                    <b>INCLUDE SOME DETAILS</b>
                    <Details
                      onTitleSelect={(title) =>
                        handleDetailsChange({ title, description })
                      }
                      onDescriptionSelect={(description) =>
                        handleDetailsChange({ title, description })
                      }
                    />{" "}
                  </h5>
                </MDBListGroupItem>
                
                {(category.toLowerCase() === "olx autos (cars)" || category.toLowerCase() === "bikes") && (
                  <MDBListGroupItem>
                    <h5>
                      <b>VEHICLE DETAILS</b>
                      <VehicleSelector onVehicleSelect={handleVehicleDataChange} />
                    </h5>
                  </MDBListGroupItem>
                )}
                
                {/* Add category fields for non-vehicle categories */}
                {!(category.toLowerCase() === "olx autos (cars)" || category.toLowerCase() === "bikes") && (
                  <MDBListGroupItem>
                    <h5>
                      <b>CATEGORY DETAILS</b>
                      <CategoryFields category={category} onCategoryDataChange={handleCategoryDataChange} />
                    </h5>
                  </MDBListGroupItem>
                )}
                
                <MDBListGroupItem>
                  <h5>
                    <b>SET A PRICE</b>
                    <Price
                      onPriceSelect={(price) => handlePriceChange(price)}
                    />
                  </h5>
                </MDBListGroupItem>

                <MDBListGroupItem>
                  <h5>
                    <b>UPLOAD UP TO 12 PHOTOS</b>
                    <br />
                    {formInputs.map((formInput) => formInput)}
                    <MDBBtn
                      type="button"
                      className="mt-2"
                      onClick={handleAddForm}
                    >
                      Add Image
                    </MDBBtn>
                  </h5>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <h5>
                    <b>CONFIRM YOUR LOCATION</b>
                    <SelectLocation
                      onlocationSelect={(location) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                      onaddressSelect={(address) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                      setAddOrLoc={(addorloc) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                    />
                  </h5>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <h5>
                    <b>REVIEW YOUR DETAILS</b>
                    <Addetails onNameSelect={handleNameSelect} onImageSelect={handleImageSelect} />
                  </h5>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <h5>
                    <form onSubmit={handleFormSubmit}>
                      <MDBBtn
                        className="mt-3"
                        type="submit"
                        size="lg"
                        color="info"
                        border="success"
                      >
                        POST
                      </MDBBtn>
                    </form>
                  </h5>
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCard>
          )}
        </MDBContainer>
      ) : (
        <NotFound />
      )}
      {loading === "redirect" && navigate('/adsuccess')}
    </div>
  );
}
