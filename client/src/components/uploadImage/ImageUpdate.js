import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export default props => 
  props.images.map((image, i) =>   
    <div key={i} className='fadein'>
      <div 
        onClick={() => props.removeImage(image.secure_url !== undefined ? image.secure_url: image)} 
        className='delete'
      >
        <FontAwesomeIcon icon={faTimesCircle} size='1x' />
      </div>
      <img className="uploadImg"
        src={image.secure_url !== undefined ? image.secure_url: image} 
        alt='' 
        onError={() => props.onError(image)}
      />
    </div> )