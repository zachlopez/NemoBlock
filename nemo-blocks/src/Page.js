import React from 'react'

const Page = (props) => {
    if (props.target === props.current) {
        return (
            <div style={{width:"100%", height:"100%"}}>
                {props.children}
            </div>
        );
    } else {
        return (
            <></>
        );
    }
}

export default Page