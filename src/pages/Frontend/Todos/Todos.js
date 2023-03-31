import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from 'context/AuthContext'
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, where, query } from 'firebase/firestore/lite'
import { firestore } from 'config/firebase'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import _ from 'lodash';

export default function Todos() {

  const { user } = useContext(AuthContext)

  const [documents, setDocuments] = useState([])
  const [todo, setTodo] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isProcessingDelete, setIsProcessingDelete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleChange = e => {
    let { name, value } = e.target
    setTodo(s => ({ ...s, [name]: value }))
  }

  const fetchDocuments = async () => {
    let array = [];

    const q = query(collection(firestore, "todos"), where("createdBy.uid", "==", user.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      array.push(data)
      // doc.data() is never undefined for query doc snapshots
      // console.log(data);
    });

    setDocuments(array)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDocuments()
  }, [user])

  const handleUpdate = async () => {
    // console.log(todo)

    let formData = { ...todo }
    formData.dateCreated = formData.dateCreated;
    formData.dateModified = serverTimestamp();
    formData.modifiedBy = {
      email: user.email,
      uid: user.uid
    }
    setIsProcessing(true)
    try {
      await setDoc(doc(firestore, "todos", formData.id), formData, { merge: true });
      window.notify("Todo has been successfully updated", "success");

      let newDocuments = documents.map((doc) => {
        if (doc.id === todo.id)
          return todo
        return doc
      })

      setDocuments(newDocuments)
    } catch (err) {
      console.error(err)
      window.notify("Something went went wrong, Todo is'nt updated", "error")
    }
    setIsProcessing(false)
  }

  const handleDelete = async (todo) => {
    setIsProcessingDelete(true)

    try {
      await deleteDoc(doc(firestore, "todos", todo.id));
      window.notify("Todo has been successfully deleted", "success")

      let newDocuments = documents.filter((doc) => {
        return doc.id !== todo.id
      })
      setDocuments(newDocuments)

    } catch (err) {
      console.error(err)
      window.notify("Something went wrong", "error")
    }
    setIsProcessingDelete(false)
  }

  return (
    <>
      <div className="py-4 d-flex justify-content-center align-items-center todoHome">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className='text-center mb-4'>My Todo</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="card p-3 p-md-4 p-lg-5">
                {!isLoading
                  ? <Table>
                    <Thead>
                      <Tr>
                        <Th>Sr. No.</Th>
                        <Th>Title</Th>
                        <Th>Location</Th>
                        <Th>Description</Th>
                        <Th>Status</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {documents.map((todo, i) => {
                        return <Tr key={i}>
                          <Td>{i + 1}</Td>
                          <Td>{todo.title}</Td>
                          <Td>{todo.location}</Td>
                          <Td>{todo.description}</Td>
                          <Td>{_.capitalize(todo.status)}</Td>
                          {/* <Td>{todo.status}</Td> */}
                          <Td>
                            <button className='btn btn-primary text-white btn-sm me-1' data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => { setTodo(todo) }}>
                              {!isProcessing
                                ? "Edit"
                                : <div className='spinner-border spinner-border-sm'></div>
                              }
                            </button>
                            <button className='btn btn-danger btn-sm' disabled={isProcessingDelete} onClick={() => { handleDelete(todo) }}>
                              {!isProcessingDelete
                                ? "Delete"
                                : <div className='spinner-border spinner-border-sm'></div>
                              }
                            </button>
                          </Td>
                        </Tr>
                      })}
                    </Tbody>
                  </Table>
                  : <div className="text-center"><div className="spinner-grow"></div></div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="editModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Update Todo</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <input type="text" className='form-control' name="title" placeholder='Enter Title' value={todo.title} onChange={handleChange} />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <input type="text" className='form-control' name="location" placeholder='Enter Location' value={todo.location} onChange={handleChange} />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <textarea name="description" className='form-control' rows="5" placeholder='Enter Description' value={todo.description} onChange={handleChange}></textarea>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <select className='form-control' name="status" value={todo.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary text-white" data-bs-dismiss="modal" onClick={handleUpdate}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}