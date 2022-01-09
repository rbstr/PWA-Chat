import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // States //
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // Functions //
  // showing / hiding password
  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Prosím vyber fotografii!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "rubes-app");
      fetch("https://api.cloudinary.com/v1_1/rubes-app/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString().replace("http", "https"));
          console.log(data.url.toString().replace("http", "https"));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Prosím vyber fotografii!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    // if not all fields inputted
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Prosím vyplň všechna požadovaná pole",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    // if password do not match with confirm password
    if (password !== confirmpassword) {
      toast({
        title: "Hesla se neshodují!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // POST request
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );

      // success notification
      toast({
        title: "Úspěšně zaregistrován!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Nastala chyba!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  // render //
  return (
    <VStack spacing="12px" color="black">
      {/* Name */}
      <FormControl id="first-name" isRequired>
        <FormLabel>Jméno</FormLabel>
        <Input
          placeholder="Zadej své jméno"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email1" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Zadej svůj email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password1" isRequired>
        <FormLabel>Heslo</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Zadej své heslo"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="6rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Schovat" : "Ukázat"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password2" isRequired>
        <FormLabel>Potvrzení hesla</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Potvrď heslo"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="6rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Schovat" : "Ukázat"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 25 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Zaregistrovat se!
      </Button>
    </VStack>
  );
};

export default Signup;
