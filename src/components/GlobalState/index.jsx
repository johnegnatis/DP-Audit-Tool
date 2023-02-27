import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
    students: [
        'John Egnatis',
        'Zia Kim',
        'Haniyyah Hamid',
        'Jared Hightower',
        'Areeba Nandwani',
        'Sai Gonuguntla',
    ],
    selected: 'Zia Kim', // TODO: eventually the students will be objects and the selected will be studentID
});

export { useGlobalState, setGlobalState }