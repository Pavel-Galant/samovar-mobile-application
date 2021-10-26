export const updateApplicationSettings = (state, data) => {
  state.application = { ...state.application, ...data };
}
