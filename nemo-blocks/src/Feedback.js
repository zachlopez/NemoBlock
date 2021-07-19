/********************************************************************************************/
/* Feedback.js                                                                              */
/*__________________________________________________________________________________________*/
/* Component that displays the google form for getting feedback.                            */
/* Uses the setPage and curUser global state variables which must be passed in as props.    */
/********************************************************************************************/

import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Documentation(props) {
    const [showNav, setShowNav] = useState(false);

    let handleLoginClick = async e => {
        e.preventDefault();
        props.setPage("Login")
    };

    let handleProgramsClick = async e => {
        e.preventDefault();
        props.setPage("Programs")
    };

    let handleDocumentationClick = async e => {
        e.preventDefault();
        props.setPage("Documentation")
    };

    return (
        <div class="mx-5 mt-5">
            <div class="navbar navbar-expand-lg navbar-light bg-light">
                <h3 style={{marginRight: "1rem"}}>NemoBlocks</h3>
                <button class="navbar-toggler" type="button" aria-expanded="false" aria-label="Toggle navigation" onClick={e => setShowNav(!showNav)}>
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class={"navbar-collapse collapse " + ((showNav) ? " show" : "")} aria-expanded="false" aria-label="Toggle navigation">
                    <div class="navbar-nav">
                        {(props.curUser==="") ? <div class="nav-item nav-link" onClick={handleLoginClick}>Login</div> : <></>}
                        {(props.curUser!=="") ? <div class="nav-item nav-link" onClick={handleProgramsClick}>Programs</div> : <></>}
                        <div class="nav-item nav-link" onClick={handleDocumentationClick}>Documentation</div>
                        <div class="nav-item nav-link active">Feedback</div>
                    </div>
                </div>
            </div>
            <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSe4cRAXWvNujAvMakCFGHoc6qgdUysEN_Ugb-2PVht1MFwi1g/viewform?embedded=true" 
                style={{
                    width:"100%",
                    height:"85vh"
                }}
                frameborder="0" 
                marginheight="0" 
                marginwidth="0"
                class="mt-4"
                title="Feedback"
            >
                Loading…
            </iframe>
        </div>
    );
}