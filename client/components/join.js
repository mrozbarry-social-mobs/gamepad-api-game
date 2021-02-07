import React from 'react';

const colors = [
  'red',
  'blue',
  'purple',
  'yellow',
  'orange',
  'green',
  'teal',
];

export default (props) => {
  const onSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    props.onSubmit({
      name: formData.get('name'),
      color: formData.get('color'),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={onSubmit} className="w-1/2">
        <h1 className="text-4xl mb-8">Join Game</h1>
        <fieldset className="mb-6">
          <label className="text-2xl block mb-4">Player Name:</label>
          <input
            className="border border-black rounded p-2 text-2xl block w-full"
            type="text"
            name="name"
            placeholder="Name"
            required
            defaultValue={props.game.name}
          />
        </fieldset>

        <fieldset className="mb-6">
          <label className="text-2xl block mb-4">Color</label>
          <select
            className="border border-black rounded p-2 text-2xl block w-full"
            name="color"
            required
            defaultValue={props.game.color}
          >
            <option value="">Pick a color</option>
            {colors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </fieldset>
        <button type="submit" className="border border-black rounded bg-blue-400 text-gray-100 text-4xl px-4 py-2">Join Server</button>
      </form>
    </div>
  );
};
