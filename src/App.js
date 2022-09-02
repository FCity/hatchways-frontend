import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Student from './components/Student'
import './App.css'

export default function App() {
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
    
    if (nameQuery !== '' && tagQuery === '') {
      results = students
                      .filter(student => (student.firstName + ' ' + student.lastName).toLowerCase().includes(nameQuery.toLowerCase()))
    } else if (nameQuery === '' && tagQuery !== '') {
      results = students
                      .filter(student => student.tags.some(tag => tag.toLowerCase().includes(tagQuery.toLowerCase())))
    } else if (nameQuery !== '' && tagQuery !== '') {
      results = students
                      .filter(student => (student.firstName + ' ' + student.lastName).toLowerCase().includes(nameQuery.toLowerCase())
                                          && student.tags.some(tag => tag.toLowerCase().includes(tagQuery.toLowerCase())))
    }

    setSearchResults(results)
  }, [nameQuery, tagQuery, students])

  const averages = useMemo(() => {
    console.log('average calculated')
    return students.map(student => {
      return student.grades.reduce((prev, curr) => {
        return Number(prev) + Number(curr)
      }) / student.grades.length
    })
  }, [students])

  // add tag to student
  const sendTag = (studentId, tagName) => {
    setStudents(students => {
      return students.map(student => {
        if (student.id === studentId) {
          student = Object.assign({}, {...student}, {tags: [...student.tags, tagName]})
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
      <div className='search-fields'>
        <div className='search-field'>
          <input
            type='text'
            className='search-bar'
            placeholder='Search by name'
            value={nameQuery}
            onChange={handleNameSearch} />
        </div>

        <div className='search-field'>
          <input
            type='text'
            className='search-bar'
            placeholder='Search by tag'
            value={tagQuery}
            onChange={handleTagSearch} />
        </div>
      </div>

      {nameQuery === '' && tagQuery === '' ?
        students.map(student => <Student key={student.id} student={student} average={averages[student.id-1]} sendTag={sendTag} />)
        :
        searchResults.map(student => <Student key={student.id} student={student} average={averages[student.id-1]} sendTag={sendTag} />)
      }
    </div>
  )
}
