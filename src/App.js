import { useState, useEffect } from 'react'
import axios from 'axios'
import Student from './components/Student'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [nameQuery, setNameQuery] = useState('')
  const [tagQuery, setTagQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  // GET students
  useEffect(() => {
    axios.get('https://api.hatchways.io/assessment/students')
      .then(res => {
        // add tags array to each student object
        let studentsWithTags = res.data.students.map(student => ({...student, tags: []}))
        setStudents(studentsWithTags)
      })
      .catch(err => console.log(err))
  }, [])

  // filter students
  useEffect(() => {
    let results = []
    
    /*
    SEARCH
      if only name search is filled
      else if only tag search is filled
      else if both name and tag search are filled
    */
    if (nameQuery !== '' && tagQuery === '') {
      results = students
                      .filter(student => (student.firstName + ' ' + student.lastName).toLowerCase().includes(nameQuery))
    } else if (nameQuery === '' && tagQuery !== '') {
      results = students
                      .filter(student => student.tags.some(tag => tag.includes(tagQuery)))
    } else if (nameQuery !== '' && tagQuery !== '') {
      results = students
                      .filter(student => (student.firstName + ' ' + student.lastName).toLowerCase().includes(nameQuery)
                                          && student.tags.some(tag => tag.includes(tagQuery)))
    }

    // set results
    setSearchResults(results)
  }, [nameQuery, tagQuery, students])

  // add tag to student
  const sendTag = (studentId, tagName) => {
    setStudents(students => {
      return students.map(student => {
        if (student.id === studentId) {
          student.tags.push(tagName)
        }

        return student
      })
    })
  }

  // handle queries
  const handleNameSearch = e => setNameQuery(e.target.value)
  const handleTagSearch = e => setTagQuery(e.target.value)

  return (
    <div className='container'>
      <div className='search'>
        <input
          type='text'
          className='search-bar'
          placeholder='Search by name'
          value={nameQuery}
          onChange={handleNameSearch} />
      </div>

      <div className='search'>
        <input
          type='text'
          className='search-bar'
          placeholder='Search by tag'
          value={tagQuery}
          onChange={handleTagSearch} />
      </div>

      {nameQuery === '' && tagQuery === '' ?
        students.map((student, i) => <Student key={i} student={student} sendTag={sendTag} />)
        :
        searchResults.map((student, i) => <Student key={i} student={student} sendTag={sendTag} />)
      }
    </div>
  )
}

export default App
