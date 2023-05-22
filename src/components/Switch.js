import React from 'react'

export default function Switch({ name, onChange }) {

  return (
    <div>
      <p>{name}</p>
      <label className="switch">
        <input type="checkbox" onChange={onChange} />
        <span className="slider"></span>
      </label>
    </div>
  )
}