const routes = handler => [
  {
    method: 'GET',
    path: '/',
    handler: (req, h) => 'hello',
  },
  {
    method: 'POST',
    path: '/notes',
    handler: handler.postNoteHandler,
  },
  {
    method: 'GET',
    path: '/notes',
    handler: handler.getNotesHandler
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: handler.getNoteHandler,
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: handler.putNoteHandler,
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: handler.deleteNoteHandler,
  },
  // {
  //   method: 'GET',
  //   path: '/query-get',
  //   handler: handler.otherHandler,
  // }
];

module.exports = routes;
