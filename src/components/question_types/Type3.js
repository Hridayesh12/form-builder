import React, { useState, useEffect, useRef } from 'react'

const Type3 = ({ questionId, questions, setQuestions, questionType, setQuestionType }) => {
    const textAreaRef = useRef(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [poll, setPoll] = useState([]);
    function ChangepollDescription(question, index) {
        let newpollDescription = [...poll];
        newpollDescription[index].pollDescription = question;
        setPoll(newpollDescription);
    }
    function ChangePollOption(option, place, index) {
        let newOption = [...poll];
        newOption[index].pollOption[place].optionValue = option;
        setPoll(newOption);
    }
    function removeOption(i, index) {
        if (i !== 0) {
            let removeOpt = [...poll];
            removeOpt[index].pollOption.splice(i, 1);
            setPoll(removeOpt);
        }
    }
    function addOption(i, index) {
        let addOption = [...poll];
        if (addOption[index].pollOption.length < 5) {
            addOption[index].pollOption[i] = { optionValue: "", optionCorrect: false };
        } else {
        }
        setPoll(addOption);
    }
    function selectCorrectOption(corOpt, i, index) {
        let selectedOption = [...poll];
        selectedOption[index].pollOption[i].optionCorrect = true;
        setPoll(selectedOption);
    }
    function addPollButton() {
        setPoll([...poll, {
            pollDescription: "",
            pollOption: [
                { optionValue: "", optionCorrect: false },
                { optionValue: "", optionCorrect: false },
            ],
        }]);
    }
    useEffect(() => {
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }, [pollQuestion])
    return (
        <div className="my-5 w-full sm:w-11/12 mx-auto flex flex-col justify-around gap-3 bg-white container rounded-lg">
            <textarea value={pollQuestion} onChange={(e) => { setPollQuestion(e.target.value) }} rows='1' ref={textAreaRef}></textarea>
            {poll?.map((item, index) => (
                <>
                    <input type="text" placeholder="Question" onChange={(e) => ChangepollDescription(e.target.value, index)} />
                    {item?.pollOption?.map((op, i) => (
                        <div>
                            <input type="radio" id="optionentry" name="contact" value={op['optionValue']} onClick={(e) => { selectCorrectOption(e.target.value, i, index) }} />
                            <label for="optionentry">
                                <input type="text" placeholder="Option" onChange={(e) => ChangePollOption(e.target.value, i, index)} />
                                <button className='px-2 py-1' onClick={() => { removeOption(i, index) }} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </label>
                        </div>
                    ))}
                    <>{item?.pollOption?.length < 5 ? (<button className='bg-blue-500 text-white rounded-lg px-2 py-1' onClick={() => addOption(item?.pollOption.length, index)}>Add Option</button>) : ""} </>
                </>
            ))}
            <button onClick={addPollButton}>Add Poll</button>
            <button onClick={console.log(poll)}>sea</button>
        </div>
    )
}

export default Type3