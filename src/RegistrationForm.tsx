import React, { FunctionComponent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import isEmpty from "lodash/isEmpty";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";

import { Registration } from "./constants/types";
import { useCreateRegistrationMutation } from "./queries/registrationQueries";

const schema = yup
  .object()
  .shape({
    username: yup
      .string()
      .min(5, "Username should be 5 chars min.")
      .required("Username is required."),
    password: yup
      .string()
      .min(8, "Password should be 8 chars min.")
      .required("Password is required."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match."),
    email: yup
      .string()
      .email("Invalid email format.")
      .required("Email is required."),
    phone: yup.string(),
    newsletter: yup.boolean(),
  })
  .required();

export type RegistrationFormInput = Omit<Registration, "id" | "text">;

export const INITIAL_VALUES: RegistrationFormInput = {
  username: "",
  password: "",
  confirmPassword: "",
  phone: "",
  email: "",
  newsletter: true,
};

type RegistrationFormProps = {
  uuid: string;
  initialValues: RegistrationFormInput;
};

const RegistrationForm: FunctionComponent<RegistrationFormProps> = ({
  uuid,
  initialValues,
}) => {
  const [open, setOpen] = useState(false);

  const createRegistration = useCreateRegistrationMutation(uuid);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: RegistrationFormInput) => {
    createRegistration.mutate(data);
  };

  useEffect(() => {
    if (createRegistration.isSuccess) {
      setOpen(true);
      reset(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createRegistration.isSuccess]);

  return (
    <>
      <form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid container item xs={12} spacing={2}>
            {createRegistration.isLoading && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Username"
                    placeholder="Username"
                    margin="normal"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    label="Confirm Password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    placeholder="some@some.com"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Phone Number"
                    placeholder="0791878745"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="newsletter"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label="Newsletter Subscription"
                    control={
                      <Checkbox
                        {...field}
                        defaultChecked={initialValues.newsletter}
                      />
                    }
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isEmpty(errors) || createRegistration.isLoading}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        message={createRegistration.data?.message}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default RegistrationForm;
