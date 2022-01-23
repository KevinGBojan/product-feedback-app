import { useContext } from "react";
import { UserContext } from "../../lib/context";
import { db } from "../../lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";

// Formik
import {
  Formik,
  Form,
  FormikValues,
  FormikHelpers,
  FastField,
  ErrorMessage,
} from "formik";

// Validation
import * as Yup from "yup";

const initialValues = {
  title: "",
  category: "",
  description: "",
};

const validationSchema = Yup.object({
  title: Yup.string().min(4).required("Please provide a title!"),
  category: Yup.string().required("Please select a category"),
  description: Yup.string()
    .min(20)
    .max(150)
    .required("Please provide a description!"),
});

export default function AddFeedback({}) {
  const { user } = useContext(UserContext);

  const onSubmit = async (values: FormikValues) => {
    const slug = values.title.replace(/\s/g, "-").toLowerCase();
    await setDoc(doc(db, "users", `${user?.uid}`, "suggestions", `${slug}`), {
      uid: user?.uid,
      title: values.title,
      description: values.description,
      category: values.category,
      slug: slug,
      upvotes: 0,
      status: "suggestion",
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      comments: [],
    });
  };

  const categoryOptions = [
    { key: "Select an option", value: "" },
    { key: "Feature", value: "feature" },
    { key: "UI", value: "ui" },
    { key: "UX", value: "ux" },
    { key: "Enhancement", value: "enhancement" },
    { key: "Bug", value: "bug" },
  ];

  return (
    <main className="w-1/3 mx-auto h-screen flex flex-col justify-center items-left">
      <Link href="/">
        <div className="text-pallet-700 font-bold flex cursor-pointer">
          <IoIosArrowBack size="24" className="text-pallet-200 mr-2" />
          <span>Go Back</span>
        </div>
      </Link>
      <Formik
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          onSubmit(values)
            .then(() => actions.setSubmitting(false))
            .then(() => actions.resetForm());
        }}
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(formik) => (
          <Form className="bg-white mt-10 py-16 px-8 rounded-lg">
            <h1 className="text-pallet-600 tracking-wider mb-8">
              Create New Feedback
            </h1>
            <div>
              <h4 className="text-pallet-600 text-lg">Feedback Title</h4>
              <p className="text-pallet-700 mb-2">
                Add a short, descriptive headline
              </p>
              <FastField
                type="text"
                name="title"
                className="w-full bg-pallet-500 outline-none rounded-md py-5 px-4 text-pallet-600"
              />
              <ErrorMessage name="title">
                {(errorMsg) => (
                  <div className="text-pallet-100">{errorMsg}</div>
                )}
              </ErrorMessage>
            </div>
            <div className="mt-10">
              <h4 className="text-pallet-600 text-lg">Category</h4>
              <p className="text-pallet-700 mb-2">
                Choose a category for your feedback
              </p>
              <FastField
                as="select"
                name="category"
                className="w-full bg-pallet-500 outline-none rounded-md py-5 px-4 text-pallet-600"
              >
                {categoryOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.key}
                    </option>
                  );
                })}
              </FastField>
              <ErrorMessage name="category">
                {(errorMsg) => (
                  <div className="text-pallet-100">{errorMsg}</div>
                )}
              </ErrorMessage>
            </div>
            <div className="mt-10">
              <h4 className="text-pallet-600 text-lg">Feedback Detail</h4>
              <p className="text-pallet-700 mb-2">
                Include any specific comments on what should be improved, added,
                etc.
              </p>
              <FastField
                as="textarea"
                type="text"
                name="description"
                className="w-full min-h-[150px] bg-pallet-500 outline-none rounded-md py-5 px-4 text-pallet-600"
              />
              <ErrorMessage name="description">
                {(errorMsg) => (
                  <div className="text-pallet-100">{errorMsg}</div>
                )}
              </ErrorMessage>
            </div>
            <div className="mt-5 flex justify-end">
              <Link href="/">
                <button
                  type="button"
                  className="cursor-pointer bg-pallet-600 font-bold text-md px-5 py-2 text-white rounded-lg mr-4"
                >
                  Cancel
                </button>
              </Link>
              <button
                className="bg-pallet-100 font-bold text-md px-5 py-2 text-white rounded-lg"
                type="submit"
                disabled={!formik.isValid && formik.isSubmitting}
              >
                Add Feedback
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
