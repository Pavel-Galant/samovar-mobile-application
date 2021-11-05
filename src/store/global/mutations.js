export const isNotConnectedCount = (state, value) => {
  state.isNotConnectedCount = value;
}
export const addTrigger = (state, value) => {
  state.triggers.push(value);
}
export const toggleTriggerState = (state, idx) => {
  state.triggers[idx].active = !state.triggers[idx].active;
}

export const removeTrigger = (state, idx) => {
  state.triggers.splice(idx, 1);
}
