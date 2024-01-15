'use client'
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';

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

async function getData(): Promise<Barang[]> {
  try {
    const response = await axios.get('http://localhost:1337/api/barangs');
    return response.data.data as Barang[];
  } catch (error) {
    throw new Error("Gagal Mendapat Data");
  }
}

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<Barang[]>([]);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [newBarang, setNewBarang] = useState({
    NamaBarang: "",
    Jenisbarang: "",
    Stokbarang: 0,
    Hargabarang: 0,
    Supliyer: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getData();
        setData(fetchedData || []);
        console.log(data)
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);

  const handleShow = (barang: Barang) => {
    setSelectedBarang(barang);
    setModalIsOpen(true)
  };
  const handleCreate = () => {
    setAddModalIsOpen(true)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBarang((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('https://localhost:1337/api/barangs', {
        data: newBarang
      });
      window.location.reload();
    } catch (error) {
      console.error('Error Adding Barang : ', error);
    }
  };

  const handleDelete = async (barang: Barang) => {
    const userConfirmed = window.confirm(`Deleting Barang : ${barang.attributes.NamaBarang}`);
    if (userConfirmed) {
      try {
        // Implement your delete logic here
        await axios.delete(`https://localhost:1337/api/barangs/${barang.id}`);
        // Fetch updated data after deletion
        const updatedData = await getData();
        setData(updatedData || []);
      } catch (error) {
        console.error('Error Deleting Barang : ', error);
      }
    } else {
      window.location.reload();
    }
  };


    const closeModal = () => {
      setSelectedBarang(null);
      setModalIsOpen(false);
    };

    return (
      <>
        <h1 style={{ color: "blue" }}>Tabel Data Barang</h1>
        <div className="form">
          <table className="table">

            <thead>
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jenis Barang</th>
              </tr>
            </thead>

            <tbody>
              {data.map((barang) => (
                <tr key= {barang.id}>
                  <td>{barang.id}</td>
                  <td>{barang.attributes.NamaBarang}</td>
                  <td>{barang.attributes.Jenisbarang}</td>
                  <td>
                    <button className="btn btn-blue" onClick={() => handleShow(barang)}>Detail</button>
                    <button className="btn btn-yellow" onClick={() => router.push(`/page/edit/${barang.id}`)}>Edit</button>
                    <button className="btn btn-red" onClick={() => handleDelete(barang)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-green" onClick={() => handleCreate()}>Tambah Barang</button>
        </div>
        <Modal 
          isOpen = {modalIsOpen}
          onRequestClose = {closeModal}
          contentLabel = "Detail Barang">

          {selectedBarang && (
            <div>
              <h2>Detail Barang</h2>
              <p>Nama Barang : {selectedBarang.attributes.NamaBarang}</p>
              <p>Jenis Barang : {selectedBarang.attributes.Jenisbarang}</p>
              <p>Stok Barang : {selectedBarang.attributes.Stokbarang}</p>
              <p>Harga Barang : {selectedBarang.attributes.Hargabarang}</p>
              <p>Supliyer : {selectedBarang.attributes.Supliyer}</p>
              <button className="btn btn-red" onClick={closeModal}>Tutup</button>
            </div>
          )}
        </Modal>

        <Modal
          isOpen = {addModalIsOpen}
          onRequestClose={() => setAddModalIsOpen(false)}
          contentLabel="Form Tambah Barang">
          
          <div>
            <h2>Edit Produk</h2>
            <form className="form">
              <label>
                Nama Barang :
                <input type="text" name="NamaBarang" onChange={handleInputChange} />
              </label>
              <label>
                Jenis Barang :
                <input type="text" name="Jenisbarang" onChange={handleInputChange} />
              </label>
              <label>
                Stok Barang :
                <input type="text" name="Stokbarang" onChange={handleInputChange} />
              </label>
              <label>
                Harga Barang :
                <input type="text" name="Hargabarang" onChange={handleInputChange} />
              </label>
              <label>
                Supliyer :
                <input type="text" name="Supliyer" onChange={handleInputChange} />
              </label>
              <div className="btn-wraper">
                <button type="button" className="btn btn-green" onClick={handleAddSubmit}>Save</button>
                <button type="button" className="btn btn-red" onClick={() => setAddModalIsOpen(false)}>Batal</button>
              </div>
            </form>
          </div>
        </Modal>
      </>
    )
}
