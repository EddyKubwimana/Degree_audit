
import Typewriter from 'typewriter-effect';

export default () =>
{
    return (
        <Typewriter
            options={{
                loop: true,
            }}
            onInit={(typewriter) => {
                typewriter
                .typeString('🚀 Automate degree auditing')
                .pauseFor(1000).deleteAll()
                .typeString('🤖 Dont be left behind')
                .pauseFor(1000).deleteAll()
                .typeString("🔥 Audit your degree today")
                .start();
            }}
        />

    )
}