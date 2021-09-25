import { useMutation, useQuery, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/queries";
import { Registration } from "../constants/types";

export const getRegistrations = async (uuid: string) => {
  const response = await fetch(`https://${uuid}.mockapi.io/register`);
  if (response.ok) {
    return response.json();
  }
  throw new Error(response.statusText);
};

export const useGetRegistrationsQuery = (uuid: string) => {
  return useQuery<Registration[], Error>(
    [QUERY_KEYS.GET_REGISTRATIONS, uuid],
    () => getRegistrations(uuid)
  );
};

export type CreateRegistrationParams = {
  uuid: string;
  data: Omit<Registration, "id" | "text">;
};

export type CreateRegistrationResponse = {
  message: string;
};

export const createRegistration = async ({
  uuid,
  data,
}: CreateRegistrationParams) => {
  const response = await fetch(`https://${uuid}.mockapi.io/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  }
  throw new Error(response.statusText);
};

export const useCreateRegistrationMutation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateRegistrationResponse,
    Error,
    Omit<Registration, "id" | "text">,
    Response
  >((data) => createRegistration({ uuid, data }), {
    mutationKey: QUERY_KEYS.CREATE_REGISTRATION,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_REGISTRATIONS]);
    },
  });
};

export type DeleteRegistrationParams = {
  uuid: string;
  id: string;
};

export const deleteRegistration = async ({
  uuid,
  id,
}: DeleteRegistrationParams) => {
  const response = await fetch(`https://${uuid}.mockapi.io/register/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return response.json();
  }
  throw new Error(response.statusText);
};

export const useDeleteRegistrationMutation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation<Registration, Error, string, Response>(
    (id) => deleteRegistration({ uuid, id }),
    {
      mutationKey: QUERY_KEYS.DELETE_REGISTRATION,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GET_REGISTRATIONS, uuid]);
      },
    }
  );
};
