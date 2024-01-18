'use client '
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

const SocialMediaLinks = () =>{
    return(
        <div className='flex flex-row gap-4'>
        <a href="https://github.com/FOOADII" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} size='2x'/>
            </a>
        <a href="https://www.linkedin.com/in/Fuad-Getachew/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} size='2x'/>
            </a>  
        </div>
    )
}
export default SocialMediaLinks