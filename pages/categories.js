import {useState, useEffect} from 'react';
import axios from 'axios';
import Layout from "@/components/Layout";

export default function Categories() {
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);

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
        await axios.post('/api/categories', {name, parentCategory});
        setName('');
        fetchCategories();
    }
    return (
        <div>
            <Layout>
                <h1>Categories</h1>
                <label>New category name</label>
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
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    )
}
