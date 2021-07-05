import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Documentation(props) {
    const [showNav, setShowNav] = useState(false);

    let handleLoginClick = async e => {
        e.preventDefault();
        props.setPage("Login");
    };

    let handleProgramsClick = async e => {
        e.preventDefault();
        props.setPage("Programs");
    };

    let handleFeedbackClick = async e => {
        e.preventDefault();
        props.setPage("Feedback");
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
                        <div class="nav-item nav-link active">Documentation</div>
                        <div class="nav-item nav-link" onClick={handleFeedbackClick}>Feedback</div>
                    </div>
                </div>
            </div>
            <div class="card mb-5 mt-4">
                <div class="card-body">
                    <h5 class="card-title">Start</h5>
                    <p class="card-text">This is one of the two blocks that appear on every NemoBlocks program.</p>
                    <p class="card-text">
                        When NemoBot runs the program, it will run the blocks inside of the Start block from top to bottom. 
                        It is good to note that, whenever the Start block gets run, any variables in the program are set to null.
                        If you need to initialize variables to some value, you can put it in the Start block.
                    </p>
                    <p class="card-text">
                        Later on, you will learn about the Ask block which can include several options. 
                        One of the options restarts the program.  
                        When this option is chosen, the program will continue at the top of Start instead of the Repeat block.
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Repeat</h5>
                    <p class="card-text">This is one of the two blocks that appear on every NemoBlocks program.</p>
                    <p class="card-text">
                        As mentioned in the Start block description, there is a block that allows you to ask users a question and give some options.
                        If the chosen option is not the restart option, then the program will continue at the top of the Repeat block.
                        In addition, if the chosen option correponds to certain variables getting changed, those variables will be updated before the top block inside of the Repeat block runs.
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Say</h5>
                    <p class="card-text">This is one of the five blocks that tells Nemobot to send something.</p>
                    <p class="card-text">
                        When Nemobot runs this block, it will send the input text to the user. 
                        After sending the text, it will then continue by running the blocks inside.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of the Start and Repeat blocks. Otherwise, it will generate an error and the block will turn red.
                        You can also use it in a function definition, but make sure that the function is used inside the Say and Repeat blocks. NemoBlocks has no way of checking this.
                        Finally, the Say block cannot be placed inside of an Ask block or any of the Option blocks. This will be also generate an error. 
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Send Image</h5>
                    <p class="card-text">This is one of the five blocks that tells Nemobot to send something.</p>
                    <p class="card-text">
                        When Nemobot runs this block, it will send the image from the given link to the user.
                        The link must begin with 'http' or 'https' and the file must have one of the following extensions: jpg, jpeg, png, gif, svg.
                        NemoBlocks will generate an error if it believes that the link does not contain an image. 
                        When this occurs, the generated program will send the link instead of the image.
                        After sending, the program will then continue by running the blocks inside.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of the Start and Repeat blocks. Otherwise, it will generate an error and the block will turn red.
                        You can also use it in a function definition, but make sure that the function is used inside the Say and Repeat blocks. NemoBlocks has no way of checking this.
                        Finally, the Say block cannot be placed inside of an Ask block or any of the Option blocks. This will be also generate an error. 
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Send Video</h5>
                    <p class="card-text">This is one of the five blocks that tells Nemobot to send something.</p>
                    <p class="card-text">
                        When Nemobot runs this block, it will send the video from the given link to the user.
                        The link must begin with 'http' or 'https' and the file must have one of the following extensions: mp4, avi, mov, flv, wmv.
                        NemoBlocks will generate an error if it believes that the link does not contain a video. 
                        When this occurs, the generated program will send the link instead of the video.
                        After sending, the program will then continue by running the blocks inside.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of the Start and Repeat blocks. Otherwise, it will generate an error and the block will turn red.
                        You can also use it in a function definition, but make sure that the function is used inside the Say and Repeat blocks. NemoBlocks has no way of checking this.
                        Finally, the Say block cannot be placed inside of an Ask block or any of the Option blocks. This will be also generate an error. 
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Send Audio</h5>
                    <p class="card-text">This is one of the five blocks that tells Nemobot to send something.</p>
                    <p class="card-text">
                        When Nemobot runs this block, it will send the audio from the given link to the user.
                        The link must begin with 'http' or 'https' and the file must have one of the following extensions: mp3, wav, aiff, aac, flac.
                        NemoBlocks will generate an error if it believes that the link does not contain an audio file. 
                        When this occurs, the generated program will send the link instead of the video.
                        After sending, the program will then continue by running the blocks inside.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of the Start and Repeat blocks. Otherwise, it will generate an error and the block will turn red.
                        You can also use it in a function definition, but make sure that the function is used inside the Say and Repeat blocks. NemoBlocks has no way of checking this.
                        Finally, the Say block cannot be placed inside of an Ask block or any of the Option blocks. This will be also generate an error. 
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Ask</h5>
                    <p class="card-text">This is one of the five blocks that tells Nemobot to send something.</p>
                    <p class="card-text">
                        When Nemobot runs this block, it will send the input text to the user. 
                        It will also send options based on the blocks inside this. 
                        You can technically add blocks that aren't Options inside of an Ask block. 
                        This is useful if you want to use Logic blocks to detemine which options to send.
                        However, you should note that changes to variables outside of Option blocks will be reset.
                        Once an option is chosen, the program will continue at the top of the Repeat block unless it is the restart option.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of the Start and Repeat blocks. Otherwise, it will generate an error and the block will turn red.
                        You can also use it in a function definition, but make sure that the function is used inside the Say and Repeat blocks. NemoBlocks has no way of checking this.
                        Finally, the Say block cannot be placed inside of an Ask block or any of the Option blocks. This will be also generate an error. 
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Option only</h5>
                    <p class="card-text">This is one of the four Option blocks.</p>
                    <p class="card-text">
                        This Option block will add an option with the input text or string.
                        If this option is chosen, no variables get updated. 
                        Nonetheless, once chosen, the program will continue at the top of the Repeat block.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of an Ask block. 
                        Otherwise, NemoBlocks will generate an error and the block will turn red.
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Option with Variable</h5>
                    <p class="card-text">This is one of the four Option blocks.</p>
                    <p class="card-text">
                        This Option block will add an option with the input text or string.
                        If this option is chosen, the selected variable will be updated and set to the input value.
                        The update will occur before the program continues at the top of the Repeat block.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of an Ask block. 
                        Otherwise, NemoBlocks will generate an error and the block will turn red.
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Option with Actions</h5>
                    <p class="card-text">This is one of the four Option blocks.</p>
                    <p class="card-text">
                        This Option block will add an option with the input text or string.
                        If this option is chosen, any changes to variables by blocks inside of it will occur. 
                        The update will occur before the program continues at the top of the Repeat block.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of an Ask block. 
                        Otherwise, NemoBlocks will generate an error and the block will turn red.
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">Option with Restart</h5>
                    <p class="card-text">This is one of the four Option blocks.</p>
                    <p class="card-text">
                        This Option block will add an option with the input text or string.
                        If this option is chosen, the program wil continue at the top of the Start block instead of the Repeat block.
                        Note that this will reset all variables.
                    </p>
                    <p class="card-text">
                        This block must be placed inside of an Ask block. 
                        Otherwise, NemoBlocks will generate an error and the block will turn red.
                    </p>
                </div>
            </div>
            <div class="card mb-5">
                <div class="card-body">
                    <h5 class="card-title">A Note on Translation</h5>
                    <p class="card-text">
                        Nemobot currently does not save variables. In other words, when an option is chosen, all of the variables are actually reset.
                        Hence, if any information needs to be kept for the next run, they have to be passed as a payload string. 
                        To simplify the programming of the chat bot, the program created by NemoBlocks takes care of saving variables and utilizing payload string.
                        This is done through two functions.
                    </p>
                    <h5 class="card-title">summarizeVariables()</h5>
                    <p class="card-text">
                        This functions packages all the variables used by the program into a dictionary object.
                        It is then turned into a string which can be passed as a payload for each option.
                        If a variable is null, it is set to an empty string.
                    </p>
                    <h5 class="card-title">updateVariables()</h5>
                    <p class="card-text">
                        This functions takes in a dictionary object and uses its values to update/restore variables in the program.
                        It is called at the beginning of the state function (Repeat block) to restore variables based on the payload.
                        If a variable is null, it is set to an empty string.
                    </p>
                </div>
            </div>
        </div>
    );
}