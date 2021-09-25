import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import RegistrationForm, { INITIAL_VALUES } from "./forms/RegistrationForm";
import RegistrationsTable from "./Tables/RegistrationsTable";

const UUID = "5e8c6579e61fbd00164aebec";

function App() {
  return (
    <Grid container direction="column">
      <Grid item>
        <Box m={8}>
          <RegistrationForm uuid={UUID} initialValues={INITIAL_VALUES} />
        </Box>
      </Grid>
      <Grid item>
        <Box m={8}>
          <RegistrationsTable uuid={UUID} />
        </Box>
      </Grid>
    </Grid>
  );
}

export default App;
