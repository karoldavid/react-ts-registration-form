import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Column, useTable } from "react-table";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { Registration } from "./constants/types";
import {
  useDeleteRegistrationMutation,
  useGetRegistrationsQuery,
} from "./queries/registrationQueries";

type RegistrationsTableProps = {
  uuid: string;
};

const RegistrationsTable: FunctionComponent<RegistrationsTableProps> = ({
  uuid,
}) => {
  const [open, setOpen] = useState(false);

  const { data = [], isFetching } = useGetRegistrationsQuery(uuid);
  const deleteRegistration = useDeleteRegistrationMutation(uuid);

  const columns = useMemo<Column<Registration>[]>(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "Username",
            accessor: "username",
          },
        ],
      },
      {
        Header: "Contact Information",
        columns: [
          {
            Header: "Email",
            accessor: "email",
          },
          {
            Header: "Phone",
            accessor: "phone",
          },
        ],
      },
      {
        Header: "Subscription",
        columns: [
          {
            Header: "Newsletter",
            accessor: (d: Registration) => {
              if (typeof d.newsletter === "boolean")
                return d.newsletter ? "yes" : "no";
              return d.newsletter;
            },
          },
          {
            Header: "Text",
            accessor: "text",
          },
        ],
      },
      {
        id: "delete",
        Cell: (tableProps: any) => (
          <Button
            color="primary"
            disabled={
              deleteRegistration.isLoading || deleteRegistration.isError
            }
            onClick={() => {
              deleteRegistration.mutate(tableProps.row.original.id);
            }}
          >
            Delete
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteRegistration.isLoading, deleteRegistration.isError]
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    if (deleteRegistration.error && !deleteRegistration.isLoading) {
      setOpen(true);
    } else if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRegistration.error, deleteRegistration.isLoading]);

  return (
    <>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid container item xs={12} spacing={2}>
          <Box sx={{ width: "100%" }}>{isFetching && <LinearProgress />}</Box>
        </Grid>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Grid>
      {deleteRegistration.error && (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={open}
          autoHideDuration={3000}
          message={`Registration Deletion Error: ${deleteRegistration.error?.message}`}
          onClose={() => {
            setOpen(false);
            deleteRegistration.reset();
          }}
        />
      )}
    </>
  );
};

export default RegistrationsTable;
