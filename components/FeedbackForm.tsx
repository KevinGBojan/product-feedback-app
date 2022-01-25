import React from "react";
import { db } from "../lib/firebase";
import {
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import { useGetUserSuggestion } from "../lib/Hooks/useGetUserSuggestion";
import toast from "react-hot-toast";

// Formik
import { Formik, Form, FormikValues, FastField, ErrorMessage } from "formik";

import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().min(4).required("Please provide a title!"),
  category: Yup.string().required("Please select a category"),

  description: Yup.string()
    .min(20)
    .max(150)
    .required("Please provide a description!"),
});

interface FeedbackType {
  uid: string | undefined;
  slug?: string | string[] | undefined;
  edit: boolean;
}

const FeedbackForm = (props: FeedbackType) => {
  // TODO: Custom select

  const { suggestion } = useGetUserSuggestion(props.uid, props.slug);

  const initialValues = {
    title: suggestion?.title || "",
    category: suggestion?.category || "",
    description: suggestion?.description || "",
    status: suggestion?.status || "Suggestion",
  };

  const router = useRouter();

  const onSubmit = async (values: FormikValues) => {
    const slug = values.title.replace(/\s/g, "-").toLowerCase();

    const suggestionRef = doc(
      db,
      "users",
      `${props.uid}`,
      "suggestions",
      `${slug}`
    );

    const docSnap = await getDoc(suggestionRef);

    if (docSnap.exists()) {
      await updateDoc(suggestionRef, {
        description: values.description,
        category: values.category,
        status: values.status,
        updatedAt: Timestamp.fromDate(new Date()),
      }).then(() => toast.success("Suggestion updated successfully!"));
    } else {
      await setDoc(suggestionRef, {
        uid: props.uid,
        title: values.title,
        description: values.description,
        category: values.category,
        slug: slug,
        upvotes: 0,
        status: values.status,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        commentCount: 0,
      }).then(() => toast.success("Suggestion created successfully!"));
    }
  };

  const onDelete = async () => {
    await deleteDoc(
      doc(db, "users", `${props.uid}`, "suggestions", `${props.slug}`)
    )
      .then(() => router.push("/"))
      .then(() => toast.success("Suggestion deleted successfully!"));
  };

  const categoryOptions = [
    { key: "Select an option", value: "" },
    { key: "Feature", value: "feature" },
    { key: "UI", value: "ui" },
    { key: "UX", value: "ux" },
    { key: "Enhancement", value: "enhancement" },
    { key: "Bug", value: "bug" },
  ];

  const statusOptions = [
    { key: "Suggestion", value: "suggestion" },
    { key: "Planned", value: "planned" },
    { key: "In-Progress", value: "inprogress" },
    { key: "Live", value: "live" },
  ];

  return (
    <main className="w-1/3 mx-auto pt-20 pb-40 flex flex-col justify-center items-left">
      <div
        className="text-pallet-700 font-bold flex cursor-pointer"
        onClick={() => router.back()}
      >
        <IoIosArrowBack size="24" className="text-pallet-200 mr-2" />
        <span>Go Back</span>
      </div>
      <Formik
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          onSubmit(values)
            .then(() => actions.setSubmitting(false))
            .then(() => actions.resetForm())
            .then(() => router.back());
        }}
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={true}
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
                disabled={props.edit}
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
              <h4 className="text-pallet-600 text-lg">Update Status</h4>
              <p className="text-pallet-700 mb-2">Change feedback state</p>
              <FastField
                as="select"
                name="status"
                className="w-full bg-pallet-500 outline-none rounded-md py-5 px-4 text-pallet-600"
              >
                {statusOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.key}
                    </option>
                  );
                })}
              </FastField>
              <ErrorMessage name="status">
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
            <div
              className={`mt-5 flex ${
                !props.edit ? "justify-end" : "justify-between"
              }`}
            >
              {props.edit && (
                <button
                  type="button"
                  className="cursor-pointer bg-[#D73737] font-bold text-sm px-5 py-2 text-white rounded-lg mr-4"
                  onClick={() => onDelete()}
                >
                  Delete
                </button>
              )}
              <div>
                <button
                  type="button"
                  className="cursor-pointer bg-pallet-600 font-bold text-sm px-5 py-2 text-white rounded-lg mr-4"
                  onClick={() => router.back()}
                >
                  Cancel
                </button>
                <button
                  className="bg-pallet-100 font-bold text-sm px-5 py-2 text-white rounded-lg"
                  type="submit"
                  disabled={!formik.isValid && formik.isSubmitting}
                >
                  Add Feedback
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default FeedbackForm;
