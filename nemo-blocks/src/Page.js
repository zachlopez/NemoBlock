/********************************************************************************************/
/* Page.js                                                                                  */
/*__________________________________________________________________________________________*/
/* Component that displays child components if the current page is the same at the target.  */
/* Requires a target prop that determines the target page name.                             */
/* Uses the page global state variables as the current prop.                                */
/* Only displays children if the target and current prop are equal.                         */
/********************************************************************************************/

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