import { getAuthToken } from "../utils/auth-helpers";

export const fetchAppointments = (advisor_id: number) => 
  fetch(`/api/users/${advisor_id}/appointments`, {
    method: "GET",
    headers: {
      Authorization: "Token " + getAuthToken(),
    },
  }).then(response => response.json());
  // return [
  //   {
  //     "id": 0,
  //     "userId": 1,
  //     "fullname": "Alexander Grob",
  //     "email": "grob.a@northeastern.edu",
  //     "nuid": "001211929",
  //     "major": "Computer Science and Math",
  //     "planId": 1,
  //     "planName": "5 Year CS Plan",
  //     "planMajor": "Computer Science",
  //     "appointmentTime": "Mar 14, 2021"
  //   },
  //   {
  //     "id": 0,
  //     "userId": 1,
  //     "fullname": "Iman Moreira",
  //     "email": "moreira.i@northeastern.edu",
  //     "nuid": "001211929",
  //     "major": "Computer Science and Bio",
  //     "planId": 1,
  //     "planName": "Memes for days",
  //     "planMajor": "Computer Science and Math",
  //     "appointmentTime": "Mar 14, 2021"
  //   },
  //   {
  //     "id": 0,
  //     "userId": 1,
  //     "fullname": "Nils Backe",
  //     "email": "backe.n@northeastern.edu",
  //     "nuid": "001211929",
  //     "major": "Computer Science",
  //     "planId": 1,
  //     "planName": "Three and out",
  //     "planMajor": "Computer Science and Design",
  //     "appointmentTime": "Mar 14, 2021"
  //   },
  //   {
  //     "id": 0,
  //     "userId": 1,
  //     "fullname": "Andrew Leung",
  //     "email": "leung.a@northeastern.edu",
  //     "nuid": "001211929",
  //     "major": "Computer Science",
  //     "planId": 1,
  //     "planName": "Lets drop some beats",
  //     "planMajor": "Computer Science",
  //     "appointmentTime": "Mar 14, 2021"
  //   },
  //   {
  //     "id": 0,
  //     "userId": 1,
  //     "fullname": "Arkin Mukherjee",
  //     "email": "mukherjee.a@northeastern.edu",
  //     "nuid": "001211929",
  //     "major": "Computer Science",
  //     "planId": 1,
  //     "planName": "gme to the moon",
  //     "planMajor": "Computer Science",
  //     "appointmentTime": "Mar 14, 2021"
  //   },
  //   {
  //     "id": 0,
  //     "userId": 1,
  //     "fullname": "Arun Jeevanantham",
  //     "email": "jeevanantham.a@northeastern.edu",
  //     "nuid": "001211929",
  //     "major": "Computer Science",
  //     "planId": 1,
  //     "planName": "A really really really long name",
  //     "planMajor": "Computer Science",
  //     "appointmentTime": "Mar 14, 2021"
  //   },
  // ];
