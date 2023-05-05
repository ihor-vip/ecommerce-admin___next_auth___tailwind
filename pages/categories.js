import {useState, useEffect} from 'react';
import axios from 'axios';
import {withSwal} from "react-sweetalert2";
import Layout from "@/components/Layout";

function Categories({swal}) {
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    },[])

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {name, parentCategory};

        if (editedCategory) {
            await axios.put('/api/categories', {...data, _id: editedCategory._id});
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }

    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name: '', values: ''}]
        })
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
         })
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((property, propertyIndex) => {
                return propertyIndex !== indexToRemove;
            });
        })
    }
    return (
        <div>
            <Layout>
                <h1>Categories</h1>
                <label>
                    {editedCategory
                        ? `Edit category ${editedCategory.name}`
                        : 'Create new category'
                    }
                </label>
                <form onSubmit={saveCategory}>
                    <div className="flex gap-1">
                        <input
                            type="text"
                            placeholder={'Category name'}
                            value={name}
                            onChange={ev => setName(ev.target.value)}
                        />

                        <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                            <option value="">No parent category</option>
                            {categories.length > 0 && categories.map(category => (
                                <option value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="block">Properties</label>
                        <button type="button" onClick={addProperty} className="btn-default text-sm mb-2">Add new property</button>

                        {properties.length > 0 && properties.map((property, index) => (
                            <div className="flex gap-1 mb-2">
                                <input
                                    type="text"
                                    className="mb-0"
                                    value={property.name}
                                    onChange={(ev) => handlePropertyNameChange(index, property, ev.target.value)}
                                    placeholder="property name (example: color)"
                                />

                                <input
                                    type="text"
                                    className="mb-0"
                                    value={property.values}
                                    onChange={(ev) => handlePropertyValuesChange(index, property, ev.target.value)}
                                    placeholder="values"
                                />

                                <button type="button" onClick={() => removeProperty(index)} className="btn-default">Remove</button>
                            </div>
                        ))}
                    </div>

                    <button type='submit' className="btn-primary py-1">Save</button>
                </form>

                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button onClick={() => editCategory(category)} className='btn-primary mr-1'>Edit</button>
                                    <button onClick={() => deleteCategory(category)} className='btn-primary'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    )
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
))
