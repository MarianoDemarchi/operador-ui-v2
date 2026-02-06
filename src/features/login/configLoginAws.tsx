import {
  Heading,
  Text,
  View,
  useAuthenticator,
  useTheme,
  Button,
} from "@aws-amplify/ui-react";
import imgLogo from "../../assets/logo_mando_transp.png"
import { Image } from "antd";

const formFields = {
  signIn: {
    username: {
      placeholder: "",
      label: "Email:",
      textAlign: "left",
      order: 1,
    },
    password: {
      label: "Contraseña:",
      placeholder: "",
      textAlign: "left",

      isRequired: false,
      order: 2,
    },
  },
  signUp: {
    password: {
      label: "Contraseña:",
      textAlign: "left",

      placeholder: "",
      isRequired: false,
      order: 2,
    },
    confirm_password: {
      textAlign: "left",

      label: "Confirme su Contraseña:",
      order: 1,
    },
  },
  forceNewPassword: {
    password: {
      textAlign: "left",

      placeholder: "Ingrese su Contraseña:",
    },
  },
  forgotPassword: {
    username: {
      textAlign: "left",
      placeholder: "Ingrese su Contraseña:",
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      textAlign: "left",

      placeholder: "Ingrese su codigo de confirmación",
      label: "Codigo de Verificación",
      isRequired: false,
    },
    confirm_password: {
      textAlign: "left",

      placeholder: "Ingrese su contraseña:",
    },
  },
  setupTotp: {
    QR: {
      totpIssuer: "test issuer",
      totpUsername: "amplify_qr_test_user",
    },
    confirmation_code: {
      textAlign: "left",

      label: "Codifo QR",
      placeholder: "Enter your Confirmation Code:",
      isRequired: true,
    },
  },
  confirmSignIn: {
    confirmation_code: {
      textAlign: "left",

      label: "Codigo:",
      placeholder: "xxxxxx",
      isRequired: true,
    },
  },
};

const components = {

  Header() {

    const { tokens } = useTheme();

    return (
      <View textAlign="center"  padding={tokens.space.large}>
       <Image width="35vh" alt="Amplify logo" src={imgLogo} /> 
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();
    const isMobile = false;

    return (
      <View textAlign="center" padding={tokens.space.small}>
        {!isMobile && (
          <Text color={tokens.colors.neutral[80]}>
            <b>Copyright © 2022 - {new Date().getFullYear()}</b>{" "}
            <a
              style={{ fontSize: "medium" }}
              href="https://doxer.com.ar/"
              target="blank"
            >
              {" "}
              Doxer SA.
            </a>{" "}
            Todos los derechos reservados.
          </Text>
        )}
      </View>
    );
  },

  SignIn: {
    Footer() {
      const { tokens } = useTheme();

      const { toForgotPassword } = useAuthenticator();

      return (
        <View padding={tokens.space.small} textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toForgotPassword}
            size="small"
            variation="link"
          >
            Cambiar contraseña{" "}
          </Button>
        </View>
      );
    },
  },

  SignUp: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Create a new account
        </Heading>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toSignIn}
            size="small"
            variation="link"
          >
            Back to Sign In
          </Button>
        </View>
      );
    },
  },
  ConfirmSignUp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Ingrese su codigo
        </Heading>
      );
    },
  },
  SetupTotp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Ingrese su codigo
        </Heading>
      );
    },
  },
  // Define other components here

  ConfirmSignIn: {
    Header() {
      return (
        <View textAlign="center" marginTop={0} padding={0}>
          {/* <Image width="12vh" alt="Authenticator logo" src={imgLogoAuten} /> */}
        </View>
      );
    },
  },
  ForgotPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Recupero de Contraseña{" "}
        </Heading>
      );
    },
  },
  ConfirmResetPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Recupero de Contraseña
        </Heading>
      );
    },
  },
};

export { formFields, components };
