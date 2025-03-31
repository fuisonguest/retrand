import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Heading,
  Divider,
  Box,
  Checkbox,
  Stack,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';
import {
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';

export default function CategoryFields({ category, onCategoryDataChange }) {
  // Car and Bike category fields
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("New");

  // Current year for dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    // Create an object with the relevant data based on the category
    let categoryData = {};
    
    if (category.toLowerCase() === "cars" || category.toLowerCase() === "bikes") {
      categoryData = {
        type: category.toLowerCase(),
        brand,
        model,
        year,
        condition
      };
    }
    
    // Pass the data to the parent component
    onCategoryDataChange(categoryData);
  }, [category, brand, model, year, condition]);

  // Render fields for Cars and Bikes
  const renderFields = () => {
        return (
          <>
        <FormControl id="brand">
                    <FormLabel>Brand</FormLabel>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
                  </FormControl>
        <FormControl id="model">
              <FormLabel>Model</FormLabel>
          <Input value={model} onChange={(e) => setModel(e.target.value)} />
            </FormControl>
        <FormControl id="year">
          <FormLabel>Year</FormLabel>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
                ))}
              </Select>
            </FormControl>
        <FormControl id="condition">
              <FormLabel>Condition</FormLabel>
          <Select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="New">New</option>
            <option value="Used">Used</option>
              </Select>
            </FormControl>
          </>
        );
  };

  return (
    <div className="mt-3 mb-3">
      <MDBCard>
        <MDBCardBody>
          <Heading size="md" mb={4}>Category Details</Heading>
          {renderFields()}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
} 