import React from 'react'

const LandingPage = () => {
  return (
    <div>
        <nav>
            <div className='nav'>
                <div className='nav-first'><h1><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22209%22%20height%3D%2255%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%23000%22%20fill-opacity%3D%22.1%22%20d%3D%22M-3492-1340h9167v-2h-9167v2zm9168%201v6896h2v-6896h-2zm-1%206897h-9167v2h9167v-2zm-9168-1v-6896h-2v6896h2zm1%201a1%201%200%2001-1-1h-2a3%203%200%20003%203v-2zm9168-1c0%20.6-.4%201-1%201v2a3%203%200%20003-3h-2zm-1-6897c.6%200%201%20.5%201%201h2a3%203%200%2000-3-3v2zm-9167-2a3%203%200%2000-3%203h2c0-.5.4-1%201-1v-2z%22%2F%3E%3Cg%20fill%3D%22%23ED0334%22%20clip-path%3D%22url%28%23a%29%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M25%2016.2c3%203%203%207.7%200%2010.6L12.8%2039c-3%203-7.7%202.9-10.6%200-3-3-3-7.7%200-10.6l12.2-12.2c3-3%207.6-3%2010.6%200zm-15%207.9l7.1%207%20.7-.7%205.3-5.4c2-1.8%202-5%200-6.9-2-1.9-5-2-7%200l-6%206z%22%20clip-rule%3D%22evenodd%22%2F%3E%3Cpath%20d%3D%22M36.7%2015.5h4.7l.2.1L49%2034.2c0%20.2.4.2.4%200l7.3-18.6.2-.1h4.6l.2.2v24c0%20.2%200%20.3-.2.3h-3.3a.3.3%200%2001-.3-.2V23.3c0-.3-.3-.4-.4-.1l-6.7%2016.7-.2.1h-3l-.2-.1-6.7-16.7c0-.3-.4-.2-.4%200v16.6l-.3.2h-3.3a.3.3%200%2001-.2-.2v-24c0-.2%200-.3.2-.3zM64%2022h3.5l.2.2L72.3%2035c0%20.3.4.3.5%200l4.4-12.8.3-.1h3.4c.1%200%20.3.1.2.3l-7.8%2020.4c-1.1%203-1.9%204.2-4.4%204.2h-3.7a.3.3%200%2001-.3-.2V44c0-.2.1-.3.3-.3h2.3c1.4%200%201.8-.3%202.3-1.8l.7-1.7V40l-6.7-17.6c0-.2%200-.3.3-.3zm18-6.5h18.1c.2%200%20.3%200%20.3.2v3.1c0%20.1-.1.3-.3.3h-6.8c-.2%200-.3%200-.3.2v20.5l-.2.2h-3.3a.3.3%200%2001-.3-.2V19.3l-.2-.2h-7a.3.3%200%2001-.2-.3v-3c0-.2.1-.3.3-.3zM191.5%2022h3.4l.2.2%204.6%2012.8c.1.3.4.3.5%200l4.5-12.8.2-.1h3.4c.2%200%20.3.1.2.3l-7.8%2020.4c-1%203-1.8%204.2-4.4%204.2h-3.7a.2.2%200%2001-.3-.2V44c0-.2.2-.3.3-.3h2.3c1.5%200%201.8-.3%202.4-1.8l.6-1.7V40l-6.6-17.6c0-.2%200-.3.2-.3zm-46.7.3c0-.2-.1-.2-.3-.2h-2.9c-.1%200-.2%200-.2.3v17.3c0%20.2%200%20.3.2.3h3.3c.1%200%20.3%200%20.3-.3V31c0-3.1%201.3-5.4%204.4-5.4h1.4c.2%200%20.3%200%20.3-.3v-3c0-.1-.1-.2-.3-.2h-.5c-2.5%200-4%20.7-5%202.1-.2.3-.4.2-.5%200l-.2-1.9zm11%2012.5c0-1.1.7-2%202.4-2.3l5.9-1.3c.1%200%20.3%200%20.3.3v1.2c0%202.8-2%204.6-5.2%204.6-2.3%200-3.4-1.1-3.4-2.5zm.6-7c.4-1.8%202-2.9%204-2.9%202.4%200%204%201.2%204%203.1%200%20.2-.2.3-.4.3l-7.2%201.5c-3.1.7-4.7%202.4-4.7%205%200%203%202.3%205.4%206.3%205.4%202.7%200%204.3-.8%205.8-2.4.3-.3.5-.2.6.2.3%201.3%201.2%202%203.2%202h1.8c.1%200%20.2%200%20.2-.3V37c0-.2%200-.3-.2-.3h-.5c-.8%200-1.2-.4-1.2-1.2v-7.1c0-4.3-2.7-6.5-7.5-6.5-4.4%200-7.5%202.3-8%205.9%200%20.2.1.3.3.3h3.2c.2%200%20.3-.1.3-.3m19.7%203.2c0-3.5%202.1-6%205.3-6%203.1%200%205.2%202.5%205.2%206%200%203.6-2%206-5.2%206s-5.3-2.4-5.3-6zm.6%207.2c1.4%201.4%203.2%202%205.3%202%205%200%208.5-3.7%208.5-9.2%200-5.4-3.5-9.1-8.5-9.1-2%200-4%20.6-5.5%202.4-.2.2-.4.2-.5-.1l-.3-1.9c0-.2%200-.2-.3-.2h-2.7c-.2%200-.3%200-.3.2v24c0%20.2%200%20.3.3.3h3.2c.2%200%20.3%200%20.3-.3v-8c0-.4.2-.4.4-.2l.1.1zM130.6%2025c2.4%200%204%201.4%204.3%202.7%200%20.4%200%20.5-.3.6l-8.8%202c-.3%200-.4%200-.4-.3%200-1.8%201.3-5%205.2-5m4.9%209c-.3%200-.3.1-.5.4-.6%201.8-2.3%202.7-4.5%202.7a4.8%204.8%200%2001-4.8-3.4c0-.2-.1-.4.2-.5l12.7-3c.3%200%20.5-.1.4-.6-.3-4-3-7.7-8.4-7.7-5.3%200-9%204-9%209.2%200%205%203%209.1%208.9%209.1%205%200%208-3.2%208.4-6.6%200-.3%200-.4-.4-.3l-3%20.7zM119%2030v9.8c0%20.1%200%20.2-.2.2h-3.2a.3.3%200%2001-.3-.2v-9.5c0-3.4-1.1-5.1-3.9-5.2-2.5%200-5%202.2-5%205.8l.1%208.9-.2.2H103a.2.2%200%2001-.3-.2v-24c0-.2.1-.3.3-.3h3.3c.1%200%20.2%200%20.2.2V24c0%20.2.3.3.5.2a7%207%200%20015.2-2.2c3.9%200%206.8%202.1%206.8%208.1z%22%2F%3E%3C%2Fg%3E%3Cdefs%3E%3CclipPath%20id%3D%22a%22%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M0%2011h208.6v36H0z%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3C%2Fsvg%3E" alt="my Theraphy" /></h1></div>
                <div className='between-head'>
                    <h1>Patients</h1>
                    <h1>Professionals</h1>
                </div>
            </div>
        </nav>
        <section className='sec1'>
            <div className='first-section'>
                <div className='first-section-first'>
                    <h1>Reliable medication reminders for you </h1>
                    <p>MyTherapy is your personal, digital health companion. Reliable medication reminders and consistent documentation of your intakes.</p>
                    <p><strong>Download now for free!</strong></p>
                    <div className='first-section-apps'>
                        <a href="https://itunes.apple.com/gb/app/mytherapy-meds-pill-reminder/id662170995?mt=8" rel="noopener noreferrer" target="_blank" >
                                        <img src="https://www.mytherapyapp.com/media/pages/en/b005a924e6-1733691130/badge-appstore-en-optimized.svg" alt="Get it on the App Store"/>
                                </a>
                        <a href="https://play.google.com/store/apps/details?id=eu.smartpatient.mytherapy&amp;referrer=utm_source%3Dwebsite-en" rel="noopener noreferrer" target="_blank" >
                                        <img src="https://www.mytherapyapp.com/media/pages/en/1f24653710-1733691130/badge-googleplay-en-optimized.svg" alt="Get it on Google Play"/>
                                </a>
                    </div>
                </div>
                <div className='first-section-second'>
                    <div>
                        <img src="https://www.mytherapyapp.com/media/pages/en/home/37fb82e5e5-1733690892/web-img1-hero-11-q65-optimized.png" alt="img" />
                    </div>
                </div>
            </div>
        </section>
        <section className='sec2'>
            <div className='first-section'>
                <div className='first-section-first'>
                    <h2>Get reminded of all your intakes thanks to reliable medication alarms</h2>
                    <p>Reliable reminders for your tablets, pills and other medications as well as measurements, doctor’s appointments or symptom checks.</p>
                    <p>The MyTherapy app keeps an eye on your medications and therapy for you, so you can focus on other important things.</p>
                </div>
                <div className='first-section-second'>
                    <img src="https://www.mytherapyapp.com/media/pages/en/home/d8d17f399e-1733690891/group-869-1-q65-optimized.png" alt="img" />
                </div>
            </div>
        </section>
        <section className='sec3'>
            <div className='first-section'>
                <div className='first-section-second'>
                    <img src="https://www.mytherapyapp.com/media/pages/en/home/cf0996ec1c-1733690891/web-img-eng-doctor-q65-optimized.png" alt="img" />
                </div>
                <div className='first-section-first'>
                    <h2>Get reminded of all your intakes thanks to reliable medication alarms</h2>
                    <p>Reliable reminders for your tablets, pills and other medications as well as measurements, doctor’s appointments or symptom checks.</p>
                    <p>The MyTherapy app keeps an eye on your medications and therapy for you, so you can focus on other important things.</p>                
                </div>
            </div>
        </section>
        <section className='sec2'>
            <div className='first-section'>
                <div className='first-section-first'>
                    <h2>Get reminded of all your intakes thanks to reliable medication alarms</h2>
                    <p>Reliable reminders for your tablets, pills and other medications as well as measurements, doctor’s appointments or symptom checks.</p>
                    <p>The MyTherapy app keeps an eye on your medications and therapy for you, so you can focus on other important things.</p>
                </div>
                <div className='first-section-second'>
                    <img src="https://www.mytherapyapp.com/media/pages/en/home/aa3bb9440d-1733690891/group-870-1-q65-optimized.png" alt="img" />
                </div>
            </div>
        </section>
        <section className='sec3'>
            <div className='first-section'>
                <div className='first-section-second'>
                    <img src="https://www.mytherapyapp.com/media/pages/en/home/44fb462e87-1733690891/group-871-1-q65-optimized.png" alt="img" />
                </div>
                <div className='first-section-first'>
                    <h2>Get reminded of all your intakes thanks to reliable medication alarms</h2>
                    <p>Reliable reminders for your tablets, pills and other medications as well as measurements, doctor’s appointments or symptom checks.</p>
                    <p>The MyTherapy app keeps an eye on your medications and therapy for you, so you can focus on other important things.</p>                
                </div>
            </div>
        </section>
        <section className='sec2'>
            <div className='first-section'>
                <div className='first-section-first'>
                    <h2>Get reminded of all your intakes thanks to reliable medication alarms</h2>
                    <p>Reliable reminders for your tablets, pills and other medications as well as measurements, doctor’s appointments or symptom checks.</p>
                    <p>The MyTherapy app keeps an eye on your medications and therapy for you, so you can focus on other important things.</p>
                </div>
                <div className='first-section-second'>
                    <img src="https://www.mytherapyapp.com/media/pages/en/home/aa3bb9440d-1733690891/group-870-1-q65-optimized.png" alt="img" />
                </div>
            </div>
        </section>
    </div>
  )
}

export default LandingPage