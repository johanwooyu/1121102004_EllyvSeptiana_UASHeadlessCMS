'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface EditPageProps {
    params: {
        slug: string;
    };
}

interface Barang {
    id: number;
    attributes: {
        NamaBarang: string;
        Jenisbarang: string;
        Stokbarang: number;
        Hargabarang: number;
        Supliyer: string;
    };
}

const EditPage = ({ params } : EditPageProps) => {
    const router = useRouter()
    const id = params.slug
    const [formData, setFormData] = useState({
        NamaBarang: "",
        Jenisbarang: "",
        Stokbarang: 0,
        Hargabarang: 0,
        Supliyer: ""
    });
    useEffect(()=> {
        const fetchData = async () => {
            try {
                if (id) {
                    const response = await axios.get(`http://localhost:1337/api/barangs/${id}`);
                    const mahasiswaData = response.data.data as Barang;
                    setFormData({
                        NamaBarang: mahasiswaData.attributes.NamaBarang,
                        Jenisbarang: mahasiswaData.attributes.Jenisbarang,
                        Stokbarang: mahasiswaData.attributes.Stokbarang,
                        Hargabarang: mahasiswaData.attributes.Hargabarang,
                        Supliyer: mahasiswaData.attributes.Supliyer,
                    });
                }
            } catch (error) {
                console.error('Error fetching Barang : ', error);
            }
        };
        
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:1337/api/barangs/${id}`, {
                data: formData,
            });
            // Redirect to the Mahasiswa list page after successful submission
            router.push('/');
        } catch (error) {
            console.error('Error updating Barang : ', error);
        }
    };

    return (
        <div className='wraper-form'>
            <form className='form' style={{width: '80%'}}>
                <label>
                    Nama Barang: 
                    <input
                        type="text"
                        name="NamaBarang"
                        value={formData.NamaBarang}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Jenis Barang: 
                    <input
                        type="text"
                        name="Jenisbarang"
                        value={formData.Jenisbarang}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Stok Barang: 
                    <input
                        type="text"
                        name="Stokbarang"
                        value={formData.Stokbarang}
                        onChange={handleChange}
                    />
                </label>
                <label>
                   Harga Barang: 
                    <input
                        type="text"
                        name="Hargabarang"
                        value={formData.Hargabarang}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Supliyer Barang: 
                    <input
                        type="text"
                        name="Supliyer"
                        value={formData.Supliyer}
                        onChange={handleChange}
                    />
                </label>
                <div className='btn-wraper'>
                    <button className='btn btn-green' type='button' onClick={handleSubmit}>
                        Simpan
                    </button>
                    <button className='btn btn-red' type='button' onClick={handleSubmit}>
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPage;