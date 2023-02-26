const students = [
    'John Egnatis',
    'Zia Kim',
    'Haniyyah Hamid',
    'Jared Hightower',
    'Areeba Nandwani',
    'Sai Gonuguntla',
]
const NavigationBar = () => {
  return (
    <header
        className='navigation-bar'
    >
        <div className="plus-icon">
            <span>+</span>
        </div>
        <ul>
            {students.map((student, index) => <li key={index}>{student}</li>)}
        </ul>
    </header>
  );
};
export default NavigationBar;