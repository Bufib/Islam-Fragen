// useFormikSetup.ts
import { useFormik } from "formik";
import * as Yup from "yup";
import { genderOptions, marjaOptions } from "components/emailOptions";
import Toast from "react-native-toast-message";

export const useFormikSetup = (
  isConnected: boolean | null,
  sendEmail: Function,
  setShowCaptcha: Function,
  setCaptchaToken: Function
) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    age: Yup.number()
      .required("Bitte gib dein Alter ein")
      .positive("Das Alter muss positiv sein")
      .typeError("Bitte gib dein Alter als Zahl ein"),
    email: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .required("E-Mail ist erforderlich"),
    validateEmail: Yup.string()
      .oneOf(
        [Yup.ref("email"), undefined],
        "E-Mail-Adressen stimmen nicht überein"
      )
      .required("Bestätige deine E-Mail"),
    marja: Yup.string().notOneOf(["default"], "Bitte wähle einen Marja aus"),
    gender: Yup.string().notOneOf(
      ["default"],
      "Bitte wähle dein Geschlecht aus"
    ),
    question: Yup.string().required("Frage ist erforderlich"),
    acceptRules: Yup.bool().oneOf([true], "Bitte akzeptiere die Richtlinien"),
  });

  return useFormik({
    initialValues: {
      name: "",
      age: "",
      email: "",
      validateEmail: "",
      marja: marjaOptions[0].value,
      gender: genderOptions[0].value,
      question: "",
      acceptRules: false,
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (isConnected) {
        setShowCaptcha(true);
      } else {
        Toast.show({
          type: "error",
          text1: "Keine Verbindung",
          text2:
            "Bitte stelle sicher, dass du mit dem Internet verbunden bist, bevor du eine Frage schickst",
        });
      }
    },
  });
};
