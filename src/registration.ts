import AutoLaunch from 'auto-launch'

export const registration = async ({
  action,
}: {
  action: 'register' | 'unregister'
}) => {
  const autoLauncher = new AutoLaunch({
    name: 'hue-actions',
    path: `${__dirname}/hue-actions-launch.js`,
  })

  if (action === 'register') {
    if (await autoLauncher.isEnabled()) {
      console.log('Background service already registered')
    } else {
      await autoLauncher.enable()
      console.log('Background service registered')
    }
  } else if (action === 'unregister') {
    if (await autoLauncher.isEnabled()) {
      console.log('Background service unregistered')
      await autoLauncher.disable()
    } else {
      console.log('Background service already not registered')
    }
  }
}
