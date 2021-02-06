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
    <form onSubmit={onSubmit}>
      <h1>Join Server</h1>
      <fieldset>
        <label>Player Name</label>
        <input type="text" name="name" placeholder="Name" required />
      </fieldset>
      <fieldset>
        <label>Color</label>
        <select name="color" required>
          <option value="">Pick a color</option>
          {colors.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </fieldset>
      <button type="submit">Join Server</button>
    </form>
  );
};
