import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const ViewAllForms = () => {
    const [forms, setForms] = useState([]);
    useEffect(() => {
        fetch('https://form-builder-backend-lzm0.onrender.com/getForm')
            .then(res => res.json())
            .then(data => setForms(data['Success']))
    }, []);
    return (
        <div className="w-full flex flex-col items-center justify-center p-10">
            <h1 className="text-3xl underline text-gray-900 my-5">All Forms</h1>
            <div className="w-full flex flex-col gap-10 items-center justify-center">
                {forms?.map((form, index) => (
                    <div className='w-10/12 h-full flex flex-col items-center p-5 justify-around gap-3 bg-white container rounded-lg'>
                        <div className="w-full flex flex-col justify-center">
                            <h1 className="text-xl text-gray-900">{form.formTitle}</h1>
                            <hr className="w-full border-2 border-gray-900" />
                            <h1 className="text-lg text-gray-900">{form.formDescription}</h1>
                            <Link to={`/view_form/${form._id}`} className="w-3/12 flex items-center justify-center bg-gray-900 text-white rounded-lg px-3 py-1 my-3">View Form</Link>
                        </div>
                    </div>
                )
                )}
            </div>
        </div>
    )
}

export default ViewAllForms