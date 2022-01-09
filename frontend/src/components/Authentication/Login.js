import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // States //
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // Functions //
  // hide or show password
  const handleClick = () => setShow(!show);

  // Log in
  const submitHandler = async () => {
    setLoading(true);

    // if not all fields inputted
    if (!email || !password) {
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

    // POST request
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // login successful
      toast({
        title: "Úspěšně přihlášen!",
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
        title: "Nastala Chyba!",
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
    <VStack spacing="10px">
      {/* Email */}
      <FormControl id="email0" isRequired>
        <FormLabel>Emailová adresa</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Zadej svou emailovou adresu"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      {/* Password */}
      <FormControl id="password0" isRequired>
        <FormLabel>Heslo</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Zadej heslo"
          />
          <InputRightElement width="6rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Schovat" : "Ukázat"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Login */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Přihlásit se!
      </Button>

      {/* Get Guest User Credentials */}
      <Button
        variant="solid"
        colorScheme="gray"
        width="100%"
        onClick={() => {
          setEmail("host@host.com");
          setPassword("123456");
        }}
      >
        Přihlásit se pomocí hosta
      </Button>
    </VStack>
  );
};

export default Login;
