$images = @(
    @{Url="https://images.unsplash.com/photo-1510312305653-8ed496efbe75?auto=format&fit=crop&q=80"; Name="events-campfire.jpg"},
    @{Url="https://images.unsplash.com/photo-1544735230-c128445cb89d?auto=format&fit=crop&q=80"; Name="events-kolukkumalai.jpg"},
    @{Url="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"; Name="events-vattavada.jpg"},
    @{Url="https://images.unsplash.com/photo-1591012911204-61aa3daaf73f?auto=format&fit=crop&q=80"; Name="sight-eravikulam.jpg"},
    @{Url="https://images.unsplash.com/photo-1634980969450-dd03af212b16?auto=format&fit=crop&q=80"; Name="sight-vagamon-meadows.jpg"},
    @{Url="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80"; Name="sight-pine-forest.jpg"},
    @{Url="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80"; Name="sight-meenmutty.jpg"},
    @{Url="https://images.unsplash.com/photo-1623302485960-d61687113a11?auto=format&fit=crop&q=80"; Name="sight-edakkal.jpg"},
    @{Url="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80"; Name="listing-luxury-glamp.jpg"},
    @{Url="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"; Name="events-trek.jpg"},
    @{Url="https://images.unsplash.com/photo-1544980649-6f92025e14cb?w=800&auto=format&fit=crop&q=80"; Name="recap-1.jpg"},
    @{Url="https://images.unsplash.com/photo-1571216682006-c4d33a1e36c2?w=800&auto=format&fit=crop&q=80"; Name="recap-2.jpg"},
    @{Url="https://images.unsplash.com/photo-1504280390367-361c6d9e6342?w=800&q=80"; Name="recap-3.jpg"},
    @{Url="https://images.unsplash.com/photo-1483385573906-8ae8ced90122?w=800&q=80"; Name="recap-4.jpg"},
    @{Url="https://images.unsplash.com/photo-1630938819488-ba7d1440d48b?w=600&q=80"; Name="story-wayanad.jpg"},
    @{Url="https://images.unsplash.com/photo-1544834830-4e2079f97621?w=600&q=80"; Name="story-kolukkumalai.jpg"},
    @{Url="https://images.unsplash.com/photo-1517824806704-9040b037703b?w=600&q=80"; Name="story-partner.jpg"}
)

foreach ($image in $images) {
    $dest = "client/public/images/site/" + $image.Name
    Write-Host "Downloading $($image.Name)..."
    try {
        Invoke-WebRequest -Uri $image.Url -OutFile $dest
    } catch {
        Write-Error "Failed to download $($image.Name)"
    }
}
