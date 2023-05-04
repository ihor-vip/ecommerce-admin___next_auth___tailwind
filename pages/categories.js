import {useState, useEffect} from 'react';
import axios from 'axios';
import Layout from "@/components/Layout";

export default function Categories() {
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
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
                <form onSubmit={saveCategory} className="flex gap-1">
                    <input
                        className='mb-0'
                        type="text"
                        placeholder={'Category name'}
                        value={name}
                        onChange={ev => setName(ev.target.value)}
                    />

                    <select className="mb-0" onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))}
                    </select>

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
                                    <button className='btn-primary'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    )
}
