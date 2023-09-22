const { nanoid } = require('nanoid');
const notes = require('./notes');


const addNote = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const newObj = {
    id,
    createdAt,
    updatedAt,
    title,
    tags,
    body,
  };
  notes.push(newObj);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getNotes = (request, h) => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNote = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((data) => data.id === id)[0];

  if (note) {
    return {
      status: 'success',
      data: {
        note,
      },

    };
  }

  return h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  }).code(404);
};

const updateNote = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    return h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  }).code(404);
};

const deleteNote = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  }).code(404);
};


module.exports = {
  addNote, getNotes, getNote, updateNote, deleteNote
};
