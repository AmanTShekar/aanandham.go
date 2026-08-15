'use client';

import React from 'react';

/**
 * Standard Form Field Label
 */
export function FieldLabel({
  children,
  required = false,
  dark = false,
  htmlFor,
  style = {}
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: 'block',
        fontSize: '11.5px',
        fontWeight: '800',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: dark ? '#D5ED55' : '#121613',
        marginBottom: '8px',
        ...style
      }}
    >
      {children}
      {required && <span style={{ color: '#E5A93B', marginLeft: '4px' }}>*</span>}
    </label>
  );
}

/**
 * Standard Input Field
 */
export function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  dark = false,
  error,
  icon,
  style = {},
  inputStyle = {},
  ...props
}) {
  return (
    <div style={{ marginBottom: '18px', width: '100%', ...style }}>
      {label && <FieldLabel required={required} dark={dark}>{label}</FieldLabel>}
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: dark ? '#8E9B92' : '#7E8B82',
              fontSize: '14px',
              pointerEvents: 'none'
            }}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            background: dark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
            border: error
              ? '1.5px solid #EF4444'
              : dark
              ? '1px solid rgba(255, 255, 255, 0.12)'
              : '1px solid rgba(18, 22, 19, 0.12)',
            borderRadius: '14px',
            padding: icon ? '14px 16px 14px 44px' : '14px 16px',
            fontSize: '14.5px',
            color: dark ? '#FFFFFF' : '#121613',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ...inputStyle
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ color: '#EF4444', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Standard Text Area Field
 */
export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  dark = false,
  error,
  style = {},
  inputStyle = {},
  ...props
}) {
  return (
    <div style={{ marginBottom: '18px', width: '100%', ...style }}>
      {label && <FieldLabel required={required} dark={dark}>{label}</FieldLabel>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        style={{
          width: '100%',
          background: dark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
          border: error
            ? '1.5px solid #EF4444'
            : dark
            ? '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid rgba(18, 22, 19, 0.12)',
          borderRadius: '14px',
          padding: '14px 16px',
          fontSize: '14.5px',
          color: dark ? '#FFFFFF' : '#121613',
          boxSizing: 'border-box',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          ...inputStyle
        }}
        {...props}
      />
      {error && (
        <span style={{ color: '#EF4444', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Standard Select Field
 */
export function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  dark = false,
  error,
  style = {},
  inputStyle = {},
  ...props
}) {
  return (
    <div style={{ marginBottom: '18px', width: '100%', ...style }}>
      {label && <FieldLabel required={required} dark={dark}>{label}</FieldLabel>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          background: dark ? '#142518' : '#FFFFFF',
          border: error
            ? '1.5px solid #EF4444'
            : dark
            ? '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid rgba(18, 22, 19, 0.12)',
          borderRadius: '14px',
          padding: '14px 16px',
          fontSize: '14.5px',
          color: dark ? '#FFFFFF' : '#121613',
          boxSizing: 'border-box',
          outline: 'none',
          cursor: 'pointer',
          ...inputStyle
        }}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ color: '#EF4444', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}
