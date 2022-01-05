const getRecipientEmail = (users, userLoggedIn) => {
  return users?.filter(
    (usertToFilter) => usertToFilter !== userLoggedIn?.email
  )[0];
};
export default getRecipientEmail;
