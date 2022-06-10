import React, { useState, useReducer } from 'react'

export default function Student({student, sendTag}) {
  const [tag, setTag] = useState('')
  const [show, toggle] = useReducer(state => !state, false)

  const handleTag = e => setTag(e.target.value)

  const addTag = e => {
    if (e.key === 'Enter' && tag !== '') {
      sendTag(student.id, tag)
      setTag('')
    }
  }

  return (
    <div className='student'>
      <div className='student-img-wrapper'>
        <img className='student-pic' src={student.pic} alt='NO PIC' />
      </div>

      <div className='student-info'>
        <h1 className='student-name'>
          {student.firstName + ' ' + student.lastName}
        </h1>
        <div className='student-details'>
          <p className='student-email'>Email: {student.email}</p>
          <p className='student-company'>Company: {student.company}</p>
          <p className='student-skill'>Skill: {student.skill}</p>
          <p className='student-average'>
            Average: 
            {student.grades.reduce((prev, curr) => {
              return Number(prev) + Number(curr)
            }) / student.grades.length}%
          </p>
        </div>

        {show && 
        <div className='student-grades'>
          <ul>
            {student.grades.map((grade, i) => (
              <li key={i}>
                Test {i+1}:
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {grade}%
              </li>
            ))}
          </ul>
        </div>
        }

        <div className='tag-section'>
          {student.tags.map((tag, i) => <div key={i} className='tag'>{tag}</div>)}
        </div>

        <div className='tag-form'>
          <input
            type='text'
            className='tag-input'
            placeholder='Add a tag'
            value={tag}
            onChange={handleTag}
            onKeyDown={addTag} />
        </div>
      </div>

      <div className='btn-wrapper'>
        <button className='btn btn-toggle' onClick={toggle}>
          {show ?
            <i className='fa fa-minus'></i>
            :
            <i className='fa fa-plus'></i>
          }
        </button>
      </div>
    </div>
  )
}
