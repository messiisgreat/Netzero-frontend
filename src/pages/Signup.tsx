import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Radio } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { useFormik } from "formik";
import { Icon } from "@iconify/react";
import Input from "../components/Input";
import { ISignupData, IUserType } from "../utils/interfaces";
import { MSG_REQUIRED_FIELD } from "../utils/constants";
import api from "../utils/api";
import useUser from "../hooks/useUser";
import useLoading from "../hooks/useLoading";
import useAlertMessage from "../hooks/useAlertMessage";
import { capitalize } from "../utils/functions";

/* -------------------------------------------------------------------- */

const validationSchema = yup.object().shape({
  firstName: yup.string().required(MSG_REQUIRED_FIELD),
  lastName: yup.string().required(MSG_REQUIRED_FIELD),
  email: yup.string().email('Invalid email type.').required(MSG_REQUIRED_FIELD),
  password: yup.string().required(MSG_REQUIRED_FIELD),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must be matched.').required(MSG_REQUIRED_FIELD)
})

/* -------------------------------------------------------------------- */

export default function Signup() {
  const navigate = useNavigate()
  const { openLoading, closeLoading } = useLoading()
  const { openAlert } = useAlertMessage()
  const { setTokenAct } = useUser()

  const [userTypes, setUserTypes] = useState<Array<IUserType>>([])
  const [userTypeId, setUserTypeId] = useState<number>(1)

  useEffect(() => {
    openLoading()
    api.get('/user/get-user-types')
      .then(response => {
        setUserTypes(response.data)
        closeLoading()
      })
      .catch(error => {
        closeLoading()
      })
  }, [])

  const initialValues: ISignupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      openLoading()
      const { firstName, lastName, email, password } = values
      api.post('/auth/signup', { firstName, lastName, email, password, userTypeId })
        .then(response => {
          if (response.data) {
            setTokenAct(response.data)
            closeLoading()
            openAlert({
              color: 'green',
              icon: <Icon icon="material-symbols:check-small-rounded" className="text-2xl" />,
              title: 'Success',
              message: 'Logged in.'
            })
            navigate('/dashboard')
          }
        })
        .catch(error => {
          closeLoading()
          if (error?.response?.status === 400) {
            return openAlert({
              color: 'blue',
              message: 'Already registered. Please login..'
            })
          }
          return openAlert({
            color: 'red',
            icon: <Icon icon="fluent-mdl2:status-error-full" className="text-2xl" />,
            title: 'Error',
            message: error?.response?.statusText || 'Sign up error.'
          })
        })
    }
  })

  const handleUserTypeId = (e: ChangeEvent<HTMLInputElement>) => {
    setUserTypeId(Number(e.target.value))
  }

  return (
    <div className="container max-w-lg mx-auto">
      <div className="my-3 md:my-12 p-6 md:shadow-2xl shadow-none">
        <h1 className="text-center font-bold text-3xl mt-4">Sign up</h1>
        <div className="mt-8 flex flex-col gap-4">

          {/* First name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="firstName">First name *</label>
            <Input
              id="firstName"
              name="firstName"
              className="border border-gray-400 rounded-md"
              onChange={formik.handleChange}
              value={formik.values.firstName}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            />
            {formik.touched.firstName && Boolean(formik.errors.firstName) && (
              <span className="text-red-500 text-sm">
                {formik.touched.firstName && formik.errors.firstName}
              </span>
            )}
          </div>

          {/* Last name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="lastName">Last name *</label>
            <Input
              id="lastName"
              name="lastName"
              className="border border-gray-400 rounded-md"
              onChange={formik.handleChange}
              value={formik.values.lastName}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            />
            {formik.touched.lastName && Boolean(formik.errors.lastName) && (
              <span className="text-red-500 text-sm">
                {formik.touched.lastName && formik.errors.lastName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email *</label>
            <Input
              id="email"
              name="email"
              type="email"
              className="border border-gray-400 rounded-md"
              onChange={formik.handleChange}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
            {formik.touched.email && Boolean(formik.errors.email) && (
              <span className="text-red-500 text-sm">
                {formik.touched.email && formik.errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password *</label>
            <Input
              id="password"
              name="password"
              type="password"
              className="border border-gray-400 rounded-md"
              onChange={formik.handleChange}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            {formik.touched.password && Boolean(formik.errors.password) && (
              <span className="text-red-500 text-sm">
                {formik.touched.password && formik.errors.password}
              </span>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm password *</label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="border border-gray-400 rounded-md"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            />
            {formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword) && (
              <span className="text-red-500 text-sm">
                {formik.touched.confirmPassword && formik.errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword">Role *</label>
            <div className="flex items-center gap-4">
              {userTypes.map((dataItem: IUserType) => (
                <Radio
                  id={dataItem.type}
                  key={dataItem.id}
                  name="userTypeId"
                  label={capitalize(dataItem.type)}
                  value={dataItem.id}
                  onChange={handleUserTypeId}
                  defaultChecked={dataItem.id === 1}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button className="bg-primary normal-case text-base mt-8" onClick={() => formik.handleSubmit()}>
            Sign up
          </Button>
          <p>
            Have account? <Link className="text-primary" to="/login">Click here</Link> to log in.
          </p>
        </div>

      </div>
    </div>
  )
}