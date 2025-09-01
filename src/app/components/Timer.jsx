import useInterval from 'beautiful-react-hooks/useInterval';

const Timer = ({ callback, interval }) => {
    useInterval(() => {
        callback();
    }, interval);
    return null;
};

export default Timer;