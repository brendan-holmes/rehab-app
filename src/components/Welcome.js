export default function Welcome() {

    const style = {
        background: '#E55934',
        height: '100vh',
        width: '100vw',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-around'
        padding: '10vh'
    };
    return (
        <div style={style}>
            <div>Visualise and track your rehab progress</div>
            <div>Sign in to get started</div>
        </div>
    )
}