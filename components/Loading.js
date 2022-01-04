import { SpinnerCircular } from 'spinners-react';

const Loading = () => {
    return (
        <center style={{display:"grid",palceItems:"center",height:"100vh"}}>
            <div className='container'>
                <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" alt="logo" 
                height={200}
                style={{marginBottom:10} }/>
                <SpinnerCircular color='#3cbc28' size={60} />
            </div>
        </center>
    )
}

export default Loading
